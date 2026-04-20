export default function BookingsSection({ bookings, id = "bookings" }) {
  return (
    <section className="bookings" id={id} aria-labelledby="bookings-title">
      <div className="bookings__panel">
        <h2 id="bookings-title" className="bookings__title">
          Current bookings
        </h2>
        <p className="bookings__lead">Public availability overview. Booking owner details are visible after sign-in.</p>

        <div className="bookings__table-wrap">
          <table className="bookings__table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={`${booking.resource}-${booking.start}`}>
                  <td className="bookings__resource">{booking.resource}</td>
                  <td>{booking.start}</td>
                  <td>{booking.end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
