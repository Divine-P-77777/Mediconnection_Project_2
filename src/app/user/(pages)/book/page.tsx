export const metadata = {
  title :"Book Appointment | MediConnection",
  description :"Easily book medical appointments with top healthcenter nearby you through MediConnection. Choose your preferred doctor, date, and time for personalized care.",
}

import BookAppointment from "./BookAppointment"

export default function BookPage() {
  return (
    <div>
      <BookAppointment/>
    </div>
  )
}