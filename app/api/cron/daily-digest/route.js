export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { sendMail } from "@/app/libs/mail/mailer";
import {
  bookingsCollection,
  emailsCollection,
  usersCollection,
  clientsCollection,
} from "@/app/libs/mongodb/db";
import { NextResponse } from "next/server";

const TZ = "Australia/Sydney";

function assertCron(req) {
  const secret = req.headers.get("x-cron-secret");

  if (
    !secret ||
    secret !== process.env.CRON_SECRET
  ) {
    throw new Error("FORBIDDEN");
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/*
 * Returns Sydney time in HH:MM format.
 *
 * hourCycle: "h23" ensures midnight is 00:00,
 * not 24:00.
 */
function hhmmNow() {
  const parts = new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: TZ,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }
  ).formatToParts(new Date());

  let hour =
    parts.find(
      (part) => part.type === "hour"
    )?.value || "00";

  const minute =
    parts.find(
      (part) => part.type === "minute"
    )?.value || "00";

  /*
   * Additional protection for environments
   * that still return 24 at midnight.
   */
  if (hour === "24") {
    hour = "00";
  }

  return `${hour}:${minute}`;
}

/*
 * Creates a Sydney calendar date key.
 *
 * offsetDays:
 * 0 = today
 * 1 = tomorrow
 */
function getSydneyDayKey(offsetDays = 0) {
  const parts = new Intl.DateTimeFormat(
    "en-AU",
    {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).formatToParts(new Date());

  const year = Number(
    parts.find(
      (part) => part.type === "year"
    )?.value
  );

  const month = Number(
    parts.find(
      (part) => part.type === "month"
    )?.value
  );

  const day = Number(
    parts.find(
      (part) => part.type === "day"
    )?.value
  );

  /*
   * UTC arithmetic is used only to move between
   * calendar dates. MongoDB still compares dates
   * using the Australia/Sydney timezone.
   */
  const shiftedDate = new Date(
    Date.UTC(
      year,
      month - 1,
      day + offsetDays
    )
  );

  return shiftedDate
    .toISOString()
    .slice(0, 10);
}

function formatDayLabel(dayKey) {
  const [year, month, day] = String(
    dayKey
  )
    .split("-")
    .map(Number);

  if (!year || !month || !day) {
    return dayKey;
  }

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  return date.toLocaleDateString("en-AU", {
    timeZone: "UTC",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/*
 * Matches a booking to a specific Sydney date.
 */
function bookingDayMatchExpr(dayKey) {
  return {
    $expr: {
      $eq: [
        {
          $dateToString: {
            date: {
              $convert: {
                input: "$bookingDate",
                to: "date",
                onError: null,
                onNull: null,
              },
            },
            format: "%Y-%m-%d",
            timezone: TZ,
            onNull: "",
          },
        },
        dayKey,
      ],
    },
  };
}

function activeBookingMatch() {
  return {
    status: {
      $nin: ["cancelled"],
    },
  };
}

async function getBookingsByInstructor(
  instructorEmail,
  targetDayKey
) {
  const bookingsCol =
    await bookingsCollection();

  return bookingsCol
    .aggregate([
      {
        $match: {
          $and: [
            {
              instructorEmail,
            },
            bookingDayMatchExpr(
              targetDayKey
            ),
            activeBookingMatch(),
          ],
        },
      },
      {
        $sort: {
          bookingDate: 1,
          bookingTime: 1,
          createdAt: 1,
        },
      },
      {
        $project: {
          serviceName: 1,
          duration: 1,
          bookingTime: 1,
          bookingDate: 1,
          clientName: 1,
          userName: 1,
          userEmail: 1,
          userPhone: 1,
          clientPhone: 1,
          address: 1,
          suburb: 1,
          status: 1,
          paymentStatus: 1,
          instructorName: 1,
          instructorEmail: 1,
        },
      },
    ])
    .toArray();
}

async function getBookingsByUser(
  userEmail,
  targetDayKey
) {
  const bookingsCol =
    await bookingsCollection();

  return bookingsCol
    .aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  userEmail,
                },
                {
                  clientEmail: userEmail,
                },
              ],
            },
            bookingDayMatchExpr(
              targetDayKey
            ),
            activeBookingMatch(),
          ],
        },
      },
      {
        $sort: {
          bookingDate: 1,
          bookingTime: 1,
          createdAt: 1,
        },
      },

      /*
       * Get the instructor's telephone number
       * from the users collection.
       */
      {
        $lookup: {
          from: "users",
          localField:
            "instructorEmail",
          foreignField: "email",
          as: "instructorUser",
        },
      },
      {
        $unwind: {
          path: "$instructorUser",
          preserveNullAndEmptyArrays:
            true,
        },
      },

      {
        $project: {
          serviceName: 1,
          duration: 1,
          bookingTime: 1,
          bookingDate: 1,
          instructorName: 1,
          instructorEmail: 1,
          userPhone: 1,
          clientPhone: 1,
          instructorPhone:
            "$instructorUser.phone",
          address: 1,
          suburb: 1,
          status: 1,
          paymentStatus: 1,
        },
      },
    ])
    .toArray();
}

async function getAllBookings(
  targetDayKey
) {
  const bookingsCol =
    await bookingsCollection();

  return bookingsCol
    .aggregate([
      {
        $match: {
          $and: [
            bookingDayMatchExpr(
              targetDayKey
            ),
            activeBookingMatch(),
          ],
        },
      },
      {
        $sort: {
          instructorEmail: 1,
          bookingTime: 1,
        },
      },
      {
        $project: {
          instructorName: 1,
          instructorEmail: 1,
          serviceName: 1,
          duration: 1,
          bookingTime: 1,
          bookingDate: 1,
          clientName: 1,
          userName: 1,
          userEmail: 1,
          address: 1,
          suburb: 1,
          status: 1,
          paymentStatus: 1,
        },
      },
    ])
    .toArray();
}

function buildInstructorDigestHtml(
  name,
  bookings,
  targetDayLabel
) {
  const rows = bookings
    .map((booking) => {
      const student =
        booking.userName ||
        booking.clientName ||
        "—";

      const phone =
        booking.userPhone ||
        booking.clientPhone ||
        "—";

      const address = [
        booking.address,
        booking.suburb,
      ]
        .filter(Boolean)
        .join(", ");

      return `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">
            ${escapeHtml(
              booking.bookingTime || "—"
            )}
          </td>

          <td style="padding:8px;border-bottom:1px solid #eee;">
            ${escapeHtml(
              `${booking.serviceName || ""} ${
                booking.duration || ""
              }`.trim()
            )}
          </td>

          <td style="padding:8px;border-bottom:1px solid #eee;">
            ${escapeHtml(student)}
          </td>

          <td style="padding:8px;border-bottom:1px solid #eee;">
            ${escapeHtml(phone)}
          </td>

          <td style="padding:8px;border-bottom:1px solid #eee;">
            ${escapeHtml(address || "—")}
          </td>

          <td style="padding:8px;border-bottom:1px solid #eee;">
            ${escapeHtml(
              booking.status || "—"
            )}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.6">
      <h2>Tomorrow's Bookings</h2>

      <p>
        Hi ${escapeHtml(
          name || "Instructor"
        )},
      </p>

      <p>
        Here are your bookings for
        <b>${escapeHtml(
          targetDayLabel
        )}</b>.
      </p>

      ${
        bookings.length
          ? `
            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr style="background:#f3f3f3">
                  <th style="text-align:left;padding:8px;">Time</th>
                  <th style="text-align:left;padding:8px;">Service</th>
                  <th style="text-align:left;padding:8px;">Student</th>
                  <th style="text-align:left;padding:8px;">Phone</th>
                  <th style="text-align:left;padding:8px;">Address</th>
                  <th style="text-align:left;padding:8px;">Status</th>
                </tr>
              </thead>

              <tbody>
                ${rows}
              </tbody>
            </table>
          `
          : `
            <p>
              <b>No bookings tomorrow.</b>
            </p>
          `
      }
    </div>
  `;
}

function buildUserDigestHtml(
  name,
  bookings,
  targetDayLabel
) {
  const rows = bookings
    .map((booking) => {
      const address = [
        booking.address,
        booking.suburb,
      ]
        .filter(Boolean)
        .join(", ");

      const yourPhone =
        booking.userPhone ||
        booking.clientPhone ||
        "—";

      const instructorPhone =
        booking.instructorPhone ||
        "—";

      return `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">
            ${escapeHtml(
              booking.bookingTime || "—"
            )}
          </td>

          <td style="padding:8px;border-bottom:1px solid #eee;">
            ${escapeHtml(
              `${booking.serviceName || ""} ${
                booking.duration || ""
              }`.trim()
            )}
          </td>

          <td style="padding:8px;border-bottom:1px solid #eee;">
            ${escapeHtml(yourPhone)}
          </td>

          <td style="padding:8px;border-bottom:1px solid #eee;">
            ${escapeHtml(
              booking.instructorName || "—"
            )}
          </td>

          <td style="padding:8px;border-bottom:1px solid #eee;">
            ${escapeHtml(
              instructorPhone
            )}
          </td>

          <td style="padding:8px;border-bottom:1px solid #eee;">
            ${escapeHtml(
              address || "—"
            )}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.6">
      <h2>Tomorrow's Lesson Reminder</h2>

      <p>
        Hi ${escapeHtml(name || "there")},
      </p>

      <p>
        You have the following booking${
          bookings.length === 1 ? "" : "s"
        } on
        <b>${escapeHtml(
          targetDayLabel
        )}</b>.
      </p>

      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#f3f3f3">
            <th style="text-align:left;padding:8px;">Time</th>
            <th style="text-align:left;padding:8px;">Service</th>
            <th style="text-align:left;padding:8px;">Your Phone</th>
            <th style="text-align:left;padding:8px;">Instructor</th>
            <th style="text-align:left;padding:8px;">Instructor Phone</th>
            <th style="text-align:left;padding:8px;">Address</th>
          </tr>
        </thead>

        <tbody>
          ${rows}
        </tbody>
      </table>

      <p style="margin-top:20px">
        Test Route Driving School
      </p>
    </div>
  `;
}

function buildAdminDigestHtml(
  bookings,
  targetDayLabel
) {
  const instructorMap = new Map();

  for (const booking of bookings) {
    const key =
      booking.instructorEmail ||
      "info@testroutedrivingschool.com.au";

    if (!instructorMap.has(key)) {
      instructorMap.set(key, {
        name:
          booking.instructorName ||
          "Instructor",
        items: [],
      });
    }

    instructorMap
      .get(key)
      .items.push(booking);
  }

  const blocks = Array.from(
    instructorMap.entries()
  )
    .map(([email, group]) => {
      const rows = group.items
        .map((booking) => {
          const student =
            booking.userName ||
            booking.clientName ||
            "—";

          const address = [
            booking.address,
            booking.suburb,
          ]
            .filter(Boolean)
            .join(", ");

          return `
            <li>
              ${escapeHtml(
                booking.bookingTime || "—"
              )}
              —
              ${escapeHtml(
                `${booking.serviceName || ""} ${
                  booking.duration || ""
                }`.trim()
              )}
              —
              ${escapeHtml(student)}
              —
              ${escapeHtml(
                address || "—"
              )}
              —
              ${escapeHtml(
                booking.status || "—"
              )}
            </li>
          `;
        })
        .join("");

      return `
        <h3 style="margin-top:16px;">
          ${escapeHtml(group.name)}
          (${escapeHtml(email)})
        </h3>

        <ul style="margin:6px 0 0 18px;">
          ${rows}
        </ul>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#111;line-height:1.6">
      <h2>Tomorrow's Bookings — All Instructors</h2>

      <p>
        Booking date:
        <b>${escapeHtml(
          targetDayLabel
        )}</b>
      </p>

      ${
        bookings.length
          ? blocks
          : `
            <p>
              <b>No bookings tomorrow.</b>
            </p>
          `
      }
    </div>
  `;
}

export async function GET(req) {
  try {
    assertCron(req);

    const nowHHMM = hhmmNow();

    /*
     * The digest runs today but contains
     * tomorrow's bookings.
     *
     * Example:
     * Cron runs 14 February at 00:00.
     * It sends bookings for 15 February.
     */
    const sendDayKey =
      getSydneyDayKey(0);

    const targetDayKey =
      getSydneyDayKey(1);

    const targetDayLabel =
      formatDayLabel(targetDayKey);

    const usersCol =
      await usersCollection();

    const clientsCol =
      await clientsCollection();

    const emailCol =
      await emailsCollection();

    /*
     * Use <= rather than an exact time match.
     *
     * This allows the next cron execution to
     * catch up if the exact configured minute
     * was missed.
     *
     * The email lock prevents duplicate sending.
     */
    const scheduleMatch = {
      $gte: "00:00",
      $lte: nowHHMM,
    };

    const userReceivers = await usersCol
      .find({
        emailScheduleTime:
          scheduleMatch,
        role: {
          $in: [
            "user",
            "instructor",
            "admin",
          ],
        },
      })
      .project({
        email: 1,
        name: 1,
        role: 1,
      })
      .toArray();

    /*
     * Do not join bookings here.
     *
     * Each client's exact tomorrow bookings
     * are checked later before sending.
     */
    const clientReceivers =
      await clientsCol
        .find({
          emailScheduleTime:
            scheduleMatch,
          roleType: "client",
        })
        .project({
          email: 1,
          linkedUserEmail: 1,
          name: 1,
          firstName: 1,
          lastName: 1,
          roleType: 1,
        })
        .toArray();

    const receiverMap = new Map();

    for (const user of userReceivers) {
      const email = String(
        user.email || ""
      )
        .trim()
        .toLowerCase();

      if (!email) continue;

      const key =
        `${email}__${user.role}`;

      if (!receiverMap.has(key)) {
        receiverMap.set(key, {
          email,
          name: user.name || "",
          role: user.role,
        });
      }
    }

    for (const client of clientReceivers) {
      const email = String(
        client.email ||
          client.linkedUserEmail ||
          ""
      )
        .trim()
        .toLowerCase();

      if (!email) continue;

      /*
       * Do not add the same email as both a
       * user and a client.
       */
      const alreadyAdded =
        Array.from(
          receiverMap.values()
        ).some(
          (receiver) =>
            receiver.email === email
        );

      if (alreadyAdded) {
        continue;
      }

      const clientName =
        client.name ||
        [
          client.firstName,
          client.lastName,
        ]
          .filter(Boolean)
          .join(" ");

      receiverMap.set(
        `${email}__client`,
        {
          email,
          name:
            clientName || "there",
          role: "client",
        }
      );
    }

    const receivers = Array.from(
      receiverMap.values()
    );

    if (!receivers.length) {
      return NextResponse.json({
        ok: true,
        sent: 0,
        skippedNoBookings: 0,
        note:
          "No email schedules are due",
        scheduledAt: nowHHMM,
        sendDayKey,
        targetDayKey,
      });
    }

    let sent = 0;
    let failed = 0;
    let duplicateSkipped = 0;
    let skippedNoBookings = 0;

    for (const receiver of receivers) {
      const to = String(
        receiver.email || ""
      )
        .trim()
        .toLowerCase();

      if (!to) continue;

      let bookings = [];
      let subject = "";
      let html = "";
      let text = "";
      let actorType = "";

      if (
        receiver.role ===
        "instructor"
      ) {
        bookings =
          await getBookingsByInstructor(
            to,
            targetDayKey
          );

        subject =
          `Tomorrow's Bookings - ${targetDayLabel}`;

        html =
          buildInstructorDigestHtml(
            receiver.name,
            bookings,
            targetDayLabel
          );

        text =
          `Hi ${
            receiver.name ||
            "Instructor"
          }, you have ${
            bookings.length
          } booking(s) on ${targetDayLabel}.`;

        actorType = "INSTRUCTOR";
      } else if (
        receiver.role === "user" ||
        receiver.role === "client"
      ) {
        bookings =
          await getBookingsByUser(
            to,
            targetDayKey
          );

        /*
         * Critical fix:
         *
         * Never send a user/client digest when
         * there are no bookings tomorrow.
         */
        if (bookings.length === 0) {
          skippedNoBookings += 1;
          continue;
        }

        subject =
          `Tomorrow's Lesson Reminder - ${targetDayLabel}`;

        html = buildUserDigestHtml(
          receiver.name,
          bookings,
          targetDayLabel
        );

        text =
          `Hi ${
            receiver.name || "there"
          }, you have ${
            bookings.length
          } booking(s) on ${targetDayLabel}.`;

        actorType = "USER";
      } else if (
        receiver.role === "admin"
      ) {
        bookings =
          await getAllBookings(
            targetDayKey
          );

        subject =
          `Tomorrow's Bookings - ${targetDayLabel}`;

        html = buildAdminDigestHtml(
          bookings,
          targetDayLabel
        );

        text =
          `Admin digest: ${
            bookings.length
          } booking(s) on ${targetDayLabel}.`;

        actorType = "ADMIN";
      } else {
        continue;
      }

      /*
       * Admin and instructors still receive
       * the digest even when bookings.length
       * is zero.
       *
       * Users and clients were skipped above.
       */

      try {
        await emailCol.insertOne({
          type: "DAILY_DIGEST",
          actorType,
          to,
          subject,
          html,
          text,
          status: "PROCESSING",
          error: null,
          hasAttachment: false,
          sentAt: null,
          createdAt: new Date(),

          /*
           * digestDay is the booking date being
           * reported, not the day the cron runs.
           */
          digestDay:
            targetDayKey,

          digestSendDay:
            sendDayKey,

          digestRole:
            receiver.role,
        });
      } catch (error) {
        /*
         * Duplicate unique-index error:
         * this digest was already processed.
         */
        if (error?.code === 11000) {
          duplicateSkipped += 1;
          continue;
        }

        throw error;
      }

      let status = "SENT";
      let errorMessage = null;

      try {
        await sendMail({
          to,
          subject,
          html,
          text,
        });
      } catch (error) {
        status = "FAILED";
        errorMessage = String(
          error?.message || error
        );
      }

      await emailCol.updateOne(
        {
          type: "DAILY_DIGEST",
          to,
          digestDay: targetDayKey,
          digestRole: receiver.role,
        },
        {
          $set: {
            actorType,
            subject,
            html,
            text,
            status,
            error: errorMessage,
            hasAttachment: false,
            sentAt:
              status === "SENT"
                ? new Date()
                : null,
            finishedAt: new Date(),
          },
        }
      );

      if (status === "SENT") {
        sent += 1;
      } else {
        failed += 1;
      }
    }

    return NextResponse.json({
      ok: true,

      sent,
      failed,

      skippedNoBookings,
      duplicateSkipped,

      scheduledAt: nowHHMM,

      /*
       * Cron execution date.
       */
      sendDayKey,

      /*
       * Date of bookings included in digest.
       */
      targetDayKey,
      targetDayLabel,
    });
  } catch (error) {
    console.error(
      "DAILY DIGEST CRON ERROR:",
      error
    );

    const status =
      error?.message === "FORBIDDEN"
        ? 403
        : 500;

    return NextResponse.json(
      {
        ok: false,
        error:
          error?.message ||
          "Server error",
      },
      {
        status,
      }
    );
  }
}