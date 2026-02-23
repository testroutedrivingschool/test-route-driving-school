import React from "react";
import Container from "./Container";

export default function HomeMap() {
  return (
    <section className="py-5">
      <Container>

      <div className="hidden md:block w-full h-[450px] rounded overflow-hidden border border-border-color">
        <iframe
          src={
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300011.7111011841!2d150.81942602049298!3d-33.82024954555311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129838f39a743f%3A0x3017d681632a850!2sSydney%20NSW%2C%20Australia!5e0!3m2!1sen!2sbd!4v1771690963427!5m2!1sen!2sbd"
          }
          width="100%"
          height="100%"
          style={{border: 0}}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          />
      </div>
{/* Mobile map */}
      <div className="md:hidden  w-full h-[450px] rounded overflow-hidden border border-border-color">
        <iframe
          src={
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d504674.47566681314!2d150.59679825606446!3d-33.80042475703519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129838f39a743f%3A0x3017d681632a850!2sSydney%20NSW%2C%20Australia!5e0!3m2!1sen!2sbd!4v1771691089561!5m2!1sen!2sbd"
          }
          width="100%"
          height="100%"
          style={{border: 0}}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          />
      </div>
          </Container>
    </section>
  );
}
