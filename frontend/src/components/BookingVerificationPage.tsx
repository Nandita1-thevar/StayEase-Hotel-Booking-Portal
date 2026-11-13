
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  Hotel,
  MapPin,
  CalendarDays,
  Users,
  CheckCircle,
  XCircle,
  LoaderCircle,
  ShieldCheck
} from 'lucide-react'

interface BookingDetails {
  bookingReference: string
  hotelName: string
  hotelLocation: string
  roomType: string
  checkIn: string
  checkOut: string
  numberOfGuests: number
  totalAmount: number
  status: string
}

const API_URL = 'http://192.168.18.89:8080/api/bookings'

export default function BookingVerification() {
  const { reference } = useParams<{ reference: string }>()

  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [verifiedAt, setVerifiedAt] = useState<Date | null>(null)

  useEffect(() => {
    async function verifyBooking() {
      try {
        const response = await fetch(
          `${API_URL}/verify/${encodeURIComponent(reference || '')}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Booking could not be verified.')
        }

        setBooking(data)
        setVerifiedAt(new Date())
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to verify booking.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (reference) {
      verifyBooking()
    } else {
      setError('Booking reference is missing.')
      setLoading(false)
    }
  }, [reference])

  function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  function formatPrice(amount: number) {
    return `₹${Number(amount).toLocaleString('en-IN')}`
  }

  return (
    <main className="verification-page">
      <div className="verification-container">

        <header className="verification-header">
          <div className="verification-brand">
            <Hotel size={25} />
            <h2>StayEase.</h2>
          </div>
          <span>BOOKING VERIFICATION</span>
        </header>

        {loading && (
          <div className="verification-message">
            <LoaderCircle className="spinner" size={40} />
            <h2>Verifying your booking...</h2>
            <p>Please wait while we retrieve the reservation.</p>
          </div>
        )}

        {!loading && error && (
          <div className="verification-message">
            <XCircle size={48} color="#dc2626" />
            <h2>Verification Failed</h2>
            <p>{error}</p>
            <p>Please check your booking reference.</p>
          </div>
        )}

        {!loading && booking && (
          <>
            <div className={`verification-status ${
              booking.status === 'CONFIRMED' ? 'verified' : 'cancelled'
            }`}>
              {booking.status === 'CONFIRMED' ? (
                <CheckCircle size={48} />
              ) : (
                <XCircle size={48} />
              )}

              <h1>
                {booking.status === 'CONFIRMED'
                  ? 'Booking Verified'
                  : 'Booking Cancelled'}
              </h1>

              <p>
                {booking.status === 'CONFIRMED'
                  ? 'This reservation is valid and confirmed.'
                  : 'This reservation has been cancelled.'}
              </p>
              {verifiedAt && (
                <p className="verification-timestamp">
                  Verified on {verifiedAt.toLocaleDateString('en-IN')} at{' '}
                  {verifiedAt.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>

            <section className="verification-details">
              <p className="verification-label">BOOKING REFERENCE</p>
              <h2>{booking.bookingReference}</h2>

              <div className="verification-hotel">
                <Hotel size={23} />
                <div>
                  <small>HOTEL</small>
                  <h3>{booking.hotelName}</h3>
                  <p>
                    <MapPin size={14} />
                    {booking.hotelLocation}
                  </p>
                </div>
              </div>

              <div className="verification-grid">
                <div>
                  <CalendarDays size={19} />
                  <small>CHECK-IN</small>
                  <strong>{formatDate(booking.checkIn)}</strong>
                </div>

                <div>
                  <CalendarDays size={19} />
                  <small>CHECK-OUT</small>
                  <strong>{formatDate(booking.checkOut)}</strong>
                </div>

                <div>
                  <Hotel size={19} />
                  <small>ROOM TYPE</small>
                  <strong>{booking.roomType}</strong>
                </div>

                <div>
                  <Users size={19} />
                  <small>GUESTS</small>
                  <strong>{booking.numberOfGuests}</strong>
                </div>
              </div>

              <div className="verification-total">
                <span>Total Amount</span>
                <strong>{formatPrice(booking.totalAmount)}</strong>
              </div>
            </section>

            <footer className="verification-footer">
              <ShieldCheck size={19} />
              <span>StayEase Secure Booking Verification</span>
            </footer>
          </>
        )}
      </div>
    </main>
  )
}
