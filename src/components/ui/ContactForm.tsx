import { useState } from "react";
import emailjs from "emailjs-com";
import { Group } from "three";
import { Html } from "@react-three/drei";
import { ColorPalette } from "../../utils/colors";
import { motion, AnimatePresence } from "framer-motion";
import "../../styles/ContactForm.scss";

export const ContactForm = ({
  paperRef,
  envelopeOpen,
}: {
  paperRef: React.RefObject<Group>;
  envelopeOpen: boolean;
}) => {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const templateParams = {
      to_email: "matt.camerato@gmail.com",
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    emailjs
      .send(
        "service_59aw3jf",
        "template_cequ1dt",
        templateParams,
        "85SuTUmREA8EOLAP8"
      )
      .then((response) => {
        console.log("Email sent successfully!", response.status, response.text);
      })
      .catch((error) => {
        console.error("Failed to send email:", error);
      });

    //actions!.close!();
    setFormData({ email: "", subject: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <group ref={paperRef}>
      <mesh name="contactForm" position={[0, 0, 0.001]}>
        <planeGeometry args={[0.35, 0.25]} />
        <meshToonMaterial color={ColorPalette.White} />
      </mesh>
      {envelopeOpen && (
        <Html position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <form className={"contact-form"} onSubmit={handleSubmit}>
                <h1>Contact Me</h1>
                <span className="to-email">
                  To:
                  <input
                    name="to-email"
                    value="matt.camerato@gmail.com"
                    disabled
                  />
                </span>
                <span className="from-email">
                  From:
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </span>
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <button type="submit">Send</button>
              </form>
            </motion.div>
          </AnimatePresence>
        </Html>
      )}
    </group>
  );
};

{
  /* <form
  className={`contact-form ${isVisible ? "visible" : ""}`}
  onSubmit={handleSubmit}
  >
  <span className="to-email">
    To:
    <input name="to-email" value="matt.camerato@gmail.com" disabled />
  </span>
  <span className="from-email">
    From:
    <input
      type="email"
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
      required
    />
  </span>
  <input
    type="text"
    name="subject"
    placeholder="Subject"
    value={formData.subject}
    onChange={handleChange}
    required
  />
  <textarea
    name="message"
    placeholder="Message"
    value={formData.message}
    onChange={handleChange}
    required
  />
  <button type="submit">Send</button>
</form> */
}
