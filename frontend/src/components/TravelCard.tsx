
import { useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {
  Download,
  MapPin,
  CalendarDays,
  Hotel,
  User,
  Users,
  Ticket,
  CheckCircle,
  LoaderCircle
} from 'lucide-react'

interface TravelCardProps {
  bookingReference: string
  customerName: string
  customerEmail: string
  hotelName: string
  hotelLocation: string
  roomType: string
  checkIn: string
  checkOut: string
  numberOfGuests: number
  totalAmount: number
  status: string
}

export default function TravelCard({
  bookingReference,
  customerName,
  customerEmail,
  hotelName,
  hotelLocation,
  roomType,
  checkIn,
  checkOut,
  numberOfGuests,
  totalAmount,
  status
}: TravelCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  // Format date
  function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Generate PDF travel card
  async function downloadPDF() {
    if (!cardRef.current) return

    try {
      setDownloading(true)

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#f5f3eb',
        useCORS: true
      })

      const image = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')

      const pageWidth = pdf.internal.pageSize.getWidth()
      const imageWidth = 180
      const imageHeight = (canvas.height * imageWidth) / canvas.width

      pdf.addImage(
        image,
        'PNG',
        (pageWidth - imageWidth) / 2,
        15,
        imageWidth,
        imageHeight
      )

      pdf.save(`StayEase-Travel-Card-${bookingReference}.pdf`)
    } catch (error) {
      console.error('Travel card PDF download failed:', error)
      alert('Unable to download the travel card. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  // QR code verification URL
  const verificationUrl =
    `http://192.168.18.89:5173/verify/${encodeURIComponent(bookingReference)}`

  return (
    <section className="travel-card-section">

      <div className="travel-card-heading">
        <p className="eyebrow">YOUR JOURNEY, ALL IN ONE PLACE</p>
        <h2>Your Digital Travel Card</h2>
        <p className="muted">
          Keep your reservation details handy throughout your trip.
        </p>
      </div>

      <div className="travel-card" ref={cardRef}>

        {/* Travel Card Header */}
        <div className="travel-card-header">
          <div className="travel-card-brand">
            <span className="travel-card-logo">
              <Hotel size={24} />
            </span>
            <span>
              StayEase<span className="brand-dot">.</span>
            </span>
          </div>

          <span className="travel-card-status">
            <CheckCircle size={14} />
            {status}
          </span>

          <p className="travel-card-label">YOUR TRAVEL CARD</p>
          <h2>Make every journey memorable.</h2>
        </div>

        {/* Travel Card Body */}
        <div className="travel-card-body">

          {/* Hotel Details */}
          <div className="travel-card-hotel">
            <p className="travel-card-caption">YOUR DESTINATION</p>
            <h2>{hotelName}</h2>
            <p className="travel-card-location">
              <MapPin size={16} />
              {hotelLocation}
            </p>
          </div>

          <div className="travel-card-divider" />

          {/* Check-in and Check-out */}
          <div className="travel-card-dates">
            <div>
              <p className="travel-card-caption">CHECK-IN</p>
              <strong>{formatDate(checkIn)}</strong>
            </div>

            <div>
              <p className="travel-card-caption">CHECK-OUT</p>
              <strong>{formatDate(checkOut)}</strong>
            </div>
          </div>

          {/* Booking Details */}
          <div className="travel-card-details">

            <div>
              <Hotel size={18} />
              <span>
                <small>ROOM TYPE</small>
                <strong>{roomType}</strong>
              </span>
            </div>

            <div>
              <Users size={18} />
              <span>
                <small>GUESTS</small>
                <strong>{numberOfGuests}</strong>
              </span>
            </div>

            <div>
              <User size={18} />
              <span>
                <small>GUEST NAME</small>
                <strong>{customerName}</strong>
              </span>
            </div>

            <div>
              <CalendarDays size={18} />
              <span>
                <small>TOTAL AMOUNT</small>
                <strong>
                  ₹{Number(totalAmount).toLocaleString('en-IN')}
                </strong>
              </span>
            </div>

          </div>

          <div className="travel-card-divider" />

          {/* Booking Reference and QR Code */}
          <div className="travel-card-bottom">

            <div className="travel-card-reference">
              <p className="travel-card-caption">BOOKING REFERENCE</p>
              <h3>{bookingReference}</h3>
              <p>{customerEmail}</p>
            </div>

            <div className="travel-card-qr">
              <QRCodeSVG
                value={verificationUrl}
                size={112}
                level="H"
                includeMargin
              />

              <small>Scan to verify booking</small>
            </div>

          </div>

          {/* Footer */}
          <div className="travel-card-footer">
            <Ticket size={16} />
            <span>
              Present this card when checking in at the hotel.
            </span>
          </div>

        </div>
      </div>

      {/* Download PDF Button */}
      <button
        type="button"
        className="search-button travel-card-download"
        onClick={downloadPDF}
        disabled={downloading}
      >
        {downloading ? (
          <LoaderCircle className="spinner" size={18} />
        ) : (
          <Download size={18} />
        )}

        {downloading
          ? 'Preparing PDF...'
          : 'Download Travel Card'}
      </button>

    </section>
  )
}
