// import { useEffect, useState } from "react";
// import emailjs from "emailjs-com";

// export const ContactForm = () => {
//   const [isVisible, setIsVisible] = useState(false);

//   const [formData, setFormData] = useState({
//     email: "",
//     subject: "",
//     message: "",
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const templateParams = {
//       to_email: "matt.camerato@gmail.com",
//       from_email: formData.email,
//       subject: formData.subject,
//       message: formData.message,
//     };

//     emailjs
//       .send(
//         "service_59aw3jf",
//         "template_cequ1dt",
//         templateParams,
//         "85SuTUmREA8EOLAP8"
//       )
//       .then((response) => {
//         console.log("Email sent successfully!", response.status, response.text);
//       })
//       .catch((error) => {
//         console.error("Failed to send email:", error);
//       });

//     actions!.close!();
//     setFormData({ email: "", subject: "", message: "" });
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   useEffect(() => {
//     if (showContactForm) {
//       requestAnimationFrame(() => setIsVisible(true));
//     }
//   }, [showContactForm]);

//   if (!showContactForm) return null;

//   return (
//     <form
//       className={`contact-form ${isVisible ? "visible" : ""}`}
//       onSubmit={handleSubmit}
//     >
//       <span className="to-email">
//         To:
//         <input name="to-email" value="matt.camerato@gmail.com" disabled />
//       </span>
//       <span className="from-email">
//         From:
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//       </span>
//       <input
//         type="text"
//         name="subject"
//         placeholder="Subject"
//         value={formData.subject}
//         onChange={handleChange}
//         required
//       />
//       <textarea
//         name="message"
//         placeholder="Message"
//         value={formData.message}
//         onChange={handleChange}
//         required
//       />
//       <button type="submit">Send</button>
//     </form>
//   );
// };
