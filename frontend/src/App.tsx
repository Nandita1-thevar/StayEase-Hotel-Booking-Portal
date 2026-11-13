
import { useEffect, useState, type FormEvent } from 'react'
import { Routes, Route } from 'react-router-dom'
import BookingVerification from './components/BookingVerificationPage'
import TravelCard from './components/TravelCard'
import {
  Search,
  Hotel as HotelIcon,
  CalendarDays,
  MapPin,
  Wifi,
  BedDouble,
  ArrowRight,
  LoaderCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Users,
  ClipboardList,
  X
} from 'lucide-react'

import { getHotels, searchHotels } from './services/hotelService'
import type { Hotel, Room } from './types/hotel'

const API_URL = 'http://localhost:8080/api/bookings'

interface Booking {
  id?: number
  bookingReference: string
  customerName: string
  customerEmail: string
  checkIn: string
  checkOut: string
  totalAmount: number
  status: string
  room?: {
    id?: number
    roomType?: string
    pricePerNight?: number
    hotel?: {
      name?: string
      location?: string
    }
  }
}

export default function App() {
  const [location, setLocation] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const [selectedRoom, setSelectedRoom] = useState<{
    hotel: Hotel
    room: Room
  } | null>(null)

  const [showBookingForm, setShowBookingForm] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [guests, setGuests] = useState(1)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null)

  const [reference, setReference] = useState('')
  const [lookupEmail, setLookupEmail] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  // Load hotels from backend
  async function loadHotels(searchLocation = '') {
    try {
      setLoading(true)
      setError('')
      setSelectedRoom(null)

      const data = searchLocation.trim()
        ? await searchHotels(searchLocation.trim())
        : await getHotels()

      setHotels(data)
      setSearched(Boolean(searchLocation.trim()))
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load hotels. Please try again.'
      )
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHotels()
  }, [])

  // Search hotels
  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (checkIn && checkOut && checkOut <= checkIn) {
      setError('Check-out date must be after check-in date.')
      return
    }

    await loadHotels(location)
  }

  // Reset search
  function handleReset() {
    setLocation('')
    setCheckIn('')
    setCheckOut('')
    loadHotels()
  }

  // Select room
  function chooseRoom(hotel: Hotel, room: Room) {
    setSelectedRoom({ hotel, room })
    setShowBookingForm(false)
    setConfirmedBooking(null)
    setBookingError('')
    setGuests(1)

    document.getElementById('booking-preview')?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  // Continue to booking form
  function continueBooking() {
    if (!selectedRoom) return

    if (!checkIn || !checkOut) {
      setBookingError(
        'Please select check-in and check-out dates in the search section first.'
      )

      document.getElementById('explore')?.scrollIntoView({
        behavior: 'smooth'
      })

      return
    }

    if (checkIn < new Date().toISOString().split('T')[0]) {
      setBookingError('Check-in cannot be in the past.')
      return
    }

    if (checkOut <= checkIn) {
      setBookingError('Check-out must be after check-in.')
      return
    }

    setBookingError('')
    setShowBookingForm(true)

    setTimeout(() => {
      document.getElementById('booking-form')?.scrollIntoView({
        behavior: 'smooth'
      })
    }, 100)
  }

  // Calculate nights
  const numberOfNights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(`${checkOut}T00:00:00`).getTime() -
              new Date(`${checkIn}T00:00:00`).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0

  // Calculate price
  const totalAmount = selectedRoom
    ? Number(selectedRoom.room.pricePerNight) * numberOfNights
    : 0

  // Create booking
  async function handleCreateBooking(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!selectedRoom) return

    if (
      guests < 1 ||
      guests > Number(selectedRoom.room.totalCapacity)
    ) {
      setBookingError(
        `This room allows a maximum of ${selectedRoom.room.totalCapacity} guests.`
      )
      return
    }

    try {
      setBookingLoading(true)
      setBookingError('')

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomId: selectedRoom.room.id,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          checkIn,
          checkOut,
          numberOfGuests: guests
        })
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          data?.message ||
          data?.detail ||
          data?.error ||
          'Unable to create booking. Please try again.'
        )
      }

      setConfirmedBooking(data as Booking)
      setShowBookingForm(false)
      setFoundBooking(null)

    } catch (err) {
      setBookingError(
        err instanceof Error
          ? err.message
          : 'Booking failed. Please try again.'
      )
    } finally {
      setBookingLoading(false)
    }
  }

  // Find booking
  async function handleLookup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      setLookupLoading(true)
      setLookupError('')
      setFoundBooking(null)

      const response = await fetch(
        `${API_URL}/${encodeURIComponent(reference.trim())}?email=${encodeURIComponent(lookupEmail.trim())}`
      )

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          data?.message ||
          data?.detail ||
          'Booking not found. Check your reference and email.'
        )
      }

      setFoundBooking(data as Booking)

    } catch (err) {
      setLookupError(
        err instanceof Error ? err.message : 'Unable to find booking.'
      )
    } finally {
      setLookupLoading(false)
    }
  }

  // Cancel booking
  async function handleCancelBooking() {
    if (!foundBooking) return

    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking?'
    )

    if (!confirmed) return

    try {
      setCancelLoading(true)
      setLookupError('')

      const response = await fetch(
        `${API_URL}/${encodeURIComponent(foundBooking.bookingReference)}/cancel?email=${encodeURIComponent(lookupEmail.trim())}`,
        {
          method: 'PUT'
        }
      )

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          data?.message ||
          data?.detail ||
          'Unable to cancel booking.'
        )
      }

      setFoundBooking(data as Booking)

    } catch (err) {
      setLookupError(
        err instanceof Error ? err.message : 'Cancellation failed.'
      )
    } finally {
      setCancelLoading(false)
    }
  }

  // Format date
  function formatDate(date: string) {
    if (!date) return '-'

    return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Format price
  function formatPrice(amount: number) {
    return `₹${Number(amount).toLocaleString('en-IN')}`
  }

  return (
    <Routes>
      <Route
        path="/verify/:reference"
        element={<BookingVerification />}
      />

      <Route
        path="*"
        element={
          <main className="page">

      {/* Navigation */}
      <nav className="nav">
        <a href="#" className="brand">
          <span className="brand-icon">
            <HotelIcon size={23} />
          </span>
          StayEase<span className="brand-dot">.</span>
        </a>

        <div className="nav-links">
          <a href="#explore">Explore stays</a>
          <a href="#my-booking">My Booking</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">YOUR JOURNEY STARTS HERE</p>

          <h1>
            Stay somewhere
            <br />
            <span>worth remembering.</span>
          </h1>

          <p className="hero-description">
            Discover beautiful stays, compare rooms and
            find the perfect place for your next journey.
          </p>
        </div>

        {/* Search form */}
        <form className="search" onSubmit={handleSearch}>

          <label className="search-field">
            <MapPin size={19} />
            <div>
              <span>Destination</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where do you want to go?"
              />
            </div>
          </label>

          <label className="search-field">
            <CalendarDays size={19} />
            <div>
              <span>Check-in</span>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
          </label>

          <label className="search-field">
            <CalendarDays size={19} />
            <div>
              <span>Check-out</span>
              <input
                type="date"
                min={checkIn || new Date().toISOString().split('T')[0]}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </label>

          <button className="search-button" type="submit">
            <Search size={18} />
            Search stays
          </button>
        </form>
      </section>

      {/* Hotel listing */}
      <section className="content" id="explore">

        <div className="section-heading">
          <div>
            <p className="eyebrow">HANDPICKED FOR YOU</p>
            <h2>
              {searched
                ? `Stays in ${location}`
                : 'Explore beautiful stays'}
            </h2>
            <p className="muted">
              {searched
                ? `${hotels.length} hotel(s) found`
                : 'Find your perfect stay from our collection.'}
            </p>
          </div>

          <button className="reset-button" onClick={handleReset}>
            <RefreshCw size={15} />
            View all hotels
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="message">
            <LoaderCircle className="spinner" size={30} />
            <p>Finding beautiful stays for you...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="message error-message">
            <p>{error}</p>
            <button onClick={() => loadHotels(location)}>
              Try again
            </button>
          </div>
        )}

        {/* Empty results */}
        {!loading && !error && hotels.length === 0 && (
          <div className="message empty">
            <HotelIcon size={35} />
            <h3>No hotels found</h3>
            <p>Try searching another destination.</p>
            <button onClick={handleReset}>Explore all hotels</button>
          </div>
        )}

        {/* Hotel cards */}
        {!loading && !error && hotels.length > 0 && (
          <div className="hotel-grid">

            {hotels.map((hotel, index) => (
              <article className="hotel-card" key={hotel.id}>

                <div className={`hotel-image image-${index % 5}`}>
                  <span className="hotel-image-icon">
                    <HotelIcon size={46} />
                  </span>
                  <span className="image-label">
                    {hotel.location}
                  </span>
                </div>

                <div className="hotel-info">

                  <div className="hotel-location">
                    <MapPin size={14} />
                    {hotel.location}
                  </div>

                  <h3>{hotel.name}</h3>

                  <p className="hotel-description">
                    {hotel.description}
                  </p>

                  <div className="amenities">
                    <Wifi size={15} />
                    <span>{hotel.amenities}</span>
                  </div>

                  <div className="room-heading">
                    <BedDouble size={17} />
                    Available room types
                  </div>

                  <div className="room-list">
                    {hotel.rooms?.map((room) => (
                      <div className="room-item" key={room.id}>
                        <div>
                          <strong>{room.roomType}</strong>
                          <small>
                            Capacity: {room.totalCapacity} guests
                          </small>
                        </div>

                        <div className="room-price">
                          <strong>
                            {formatPrice(Number(room.pricePerNight))}
                          </strong>
                          <small>per night</small>
                        </div>

                        <button
                          className="choose-button"
                          onClick={() => chooseRoom(hotel, room)}
                          type="button"
                        >
                          Choose
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              </article>
            ))}

          </div>
        )}
      </section>

      {/* Selected room */}
      {selectedRoom && !confirmedBooking && (
        <section className="selected-room" id="booking-preview">
          <div>
            <p className="eyebrow">YOUR SELECTED ROOM</p>
            <h2>{selectedRoom.hotel.name}</h2>
            <p>
              {selectedRoom.room.roomType} · {selectedRoom.hotel.location}
            </p>
            <strong>
              {formatPrice(Number(selectedRoom.room.pricePerNight))}
              <small> / night</small>
            </strong>
          </div>

          <button type="button" onClick={continueBooking}>
            Continue <ArrowRight size={17} />
          </button>
        </section>
      )}

      {/* Booking form */}
      {showBookingForm && selectedRoom && (
        <section className="booking-section" id="booking-form">
          <p className="eyebrow">COMPLETE YOUR RESERVATION</p>
          <h2>Guest details</h2>
          <p className="muted">
            Enter your details to confirm your stay.
          </p>

          <form onSubmit={handleCreateBooking} className="search">

            <label className="search-field">
              <User size={19} />
              <div>
                <span>Full name</span>
                <input
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
            </label>

            <label className="search-field">
              <Mail size={19} />
              <div>
                <span>Email address</span>
                <input
                  required
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </label>

            <label className="search-field">
              <Users size={19} />
              <div>
                <span>Number of guests</span>
                <input
                  required
                  type="number"
                  min="1"
                  max={selectedRoom.room.totalCapacity}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                />
              </div>
            </label>

            <div className="search-field">
              <CalendarDays size={19} />
              <div>
                <span>Check-in</span>
                <strong>{formatDate(checkIn)}</strong>
              </div>
            </div>

            <div className="search-field">
              <CalendarDays size={19} />
              <div>
                <span>Check-out</span>
                <strong>{formatDate(checkOut)}</strong>
              </div>
            </div>

            <div className="search-field">
              <ClipboardList size={19} />
              <div>
                <span>Duration and total</span>
                <strong>
                  {numberOfNights} nights · {formatPrice(totalAmount)}
                </strong>
              </div>
            </div>

            {bookingError && (
              <p className="error-message">{bookingError}</p>
            )}

            <button
              className="search-button"
              type="submit"
              disabled={bookingLoading}
            >
              {bookingLoading ? (
                <LoaderCircle className="spinner" size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
              {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
            </button>

            <button
              className="reset-button"
              type="button"
              onClick={() => {
                setShowBookingForm(false)
                setBookingError('')
              }}
            >
              <X size={16} />
              Close form
            </button>
          </form>
        </section>
      )}

      {/* Booking confirmation */}
      {confirmedBooking && (
        <section className="booking-section" id="booking-confirmation">
          <div className="message">
            <CheckCircle size={48} color="green" />
            <p className="eyebrow">RESERVATION SUCCESSFUL</p>
            <h2>Your stay is confirmed!</h2>
            <p className="muted">
              Thank you for booking with StayEase.
            </p>

            <div className="selected-room">
              <div>
                <p>Booking reference</p>
                <h2>{confirmedBooking.bookingReference}</h2>
                <p>{confirmedBooking.customerName}</p>
                <p>{confirmedBooking.customerEmail}</p>
                <p>
                  {formatDate(confirmedBooking.checkIn)} – {formatDate(confirmedBooking.checkOut)}
                </p>
                <strong>
                  {formatPrice(confirmedBooking.totalAmount)}
                </strong>
                <p>Status: {confirmedBooking.status}</p>
              </div>
            </div>

            {/* Digital Travel Card */}
            {selectedRoom && (
              <TravelCard
                bookingReference={confirmedBooking.bookingReference}
                customerName={confirmedBooking.customerName}
                customerEmail={confirmedBooking.customerEmail}
                hotelName={selectedRoom.hotel.name}
                hotelLocation={selectedRoom.hotel.location}
                roomType={selectedRoom.room.roomType}
                checkIn={confirmedBooking.checkIn}
                checkOut={confirmedBooking.checkOut}
                numberOfGuests={guests}
                totalAmount={confirmedBooking.totalAmount}
                status={confirmedBooking.status}
              />
            )}

            <button
              className="search-button"
              onClick={() => {
                setReference(confirmedBooking.bookingReference)
                setLookupEmail(confirmedBooking.customerEmail)
                setFoundBooking(confirmedBooking)
                document.getElementById('my-booking')?.scrollIntoView({
                  behavior: 'smooth'
                })
              }}
            >
              View my booking <ArrowRight size={17} />
            </button>
          </div>
        </section>
      )}

      {/* My Booking */}
      <section className="booking-section" id="my-booking">
        <p className="eyebrow">YOUR RESERVATIONS</p>
        <h2>My Booking</h2>
        <p className="muted">
          Retrieve your reservation using your booking reference and email.
        </p>

        <form className="search" onSubmit={handleLookup}>
          <label className="search-field">
            <ClipboardList size={19} />
            <div>
              <span>Booking reference</span>
              <input
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. HTL-12345678"
              />
            </div>
          </label>

          <label className="search-field">
            <Mail size={19} />
            <div>
              <span>Email address</span>
              <input
                required
                type="email"
                value={lookupEmail}
                onChange={(e) => setLookupEmail(e.target.value)}
                placeholder="Enter booking email"
              />
            </div>
          </label>

          <button
            className="search-button"
            type="submit"
            disabled={lookupLoading}
          >
            {lookupLoading ? (
              <LoaderCircle className="spinner" size={18} />
            ) : (
              <Search size={18} />
            )}
            {lookupLoading ? 'Searching...' : 'Find Booking'}
          </button>
        </form>

        {lookupError && (
          <p className="error-message">{lookupError}</p>
        )}

        {foundBooking && (
          <div className="selected-room">
            <div>
              <p className="eyebrow">BOOKING DETAILS</p>
              <h2>{foundBooking.bookingReference}</h2>
              <p>{foundBooking.customerName}</p>
              <p>{foundBooking.customerEmail}</p>
              <p>
                {formatDate(foundBooking.checkIn)} – {formatDate(foundBooking.checkOut)}
              </p>
              <p>
                {foundBooking.room?.hotel?.name || 'Hotel reservation'}
                {foundBooking.room?.roomType
                  ? ` · ${foundBooking.room.roomType}`
                  : ''}
              </p>
              <h3>{formatPrice(foundBooking.totalAmount)}</h3>
              <p>
                Status: <strong>{foundBooking.status}</strong>
              </p>
            </div>

            {foundBooking.status === 'CONFIRMED' && (
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <LoaderCircle className="spinner" size={18} />
                ) : (
                  <XCircle size={18} />
                )}
                {cancelLoading ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <a href="#" className="brand">
          <HotelIcon size={20} /> StayEase.
        </a>
        <p>Find your stay. Make memories.</p>
      </footer>

            </main>
      }
    />
  </Routes>
)
}
