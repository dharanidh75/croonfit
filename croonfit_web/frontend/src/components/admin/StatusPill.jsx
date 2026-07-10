import React from 'react'

export function StatusPill({ status, type = 'order' }) {
  // type can be 'order' or 'payment'
  
  let pillClass = "status-pill"
  
  if (type === 'order') {
    switch (status) {
      case 'PENDING': pillClass += " status-pill-pending"; break;
      case 'PLACED': pillClass += " status-pill-placed"; break;
      case 'SHIPPED': pillClass += " status-pill-shipped"; break;
      case 'DELIVERED': pillClass += " status-pill-delivered"; break;
      case 'CANCELLED': pillClass += " status-pill-cancelled"; break;
      default: pillClass += " border-gray-mid text-text";
    }
  } else if (type === 'payment') {
    switch (status) {
      case 'UNPAID': pillClass += " status-pill-pending"; break;
      case 'PAID': pillClass += " status-pill-delivered"; break;
      case 'REFUNDED': pillClass += " status-pill-cancelled"; break;
      default: pillClass += " border-gray-mid text-text";
    }
  }

  return (
    <span className={pillClass}>
      {status}
    </span>
  )
}
