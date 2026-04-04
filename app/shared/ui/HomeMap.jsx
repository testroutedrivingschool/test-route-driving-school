import React from "react";
import Container from "./Container";

export default function HomeMap() {
  return (
    <section className="py-5">
      <Container>

      <div className="hidden md:block w-full h-[450px] rounded overflow-hidden border border-border-color">
        <iframe
          src={
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.1921998148187!2d151.1289021!3d-33.9618991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b99c02de074f%3A0x95b44233fd6b6d18!2sTest%20Route%20Driving%20School!5e0!3m2!1sen!2sbd!4v1766326342009!5m2!1sen!2sbd"
          }
          width="100%"
          height="100%"
          style={{border: 0}}
          allowFullScreen
          loading="lazy"
            title="Google Map showing our suburbs area"
          referrerPolicy="no-referrer-when-downgrade"
          />
      </div>
{/* Mobile map */}
      <div className="md:hidden  w-full h-[450px] rounded overflow-hidden border border-border-color">
        <iframe
          src={
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.1921998148187!2d151.1289021!3d-33.9618991!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b99c02de074f%3A0x95b44233fd6b6d18!2sTest%20Route%20Driving%20School!5e0!3m2!1sen!2sbd!4v1766326342009!5m2!1sen!2sbd"
          }
          width="100%"
          height="100%"
          style={{border: 0}}
          allowFullScreen
          loading="lazy"
            title="Google Map showing our suburbs area"
          referrerPolicy="no-referrer-when-downgrade"
          />
      </div>
          </Container>
    </section>
  );
}
