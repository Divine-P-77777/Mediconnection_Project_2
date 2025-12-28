export const metadata = {
    title: " Manage Center - Health Center",
    description: "Manage your health center's services and schedule."
}

import React from 'react'
import ManageTime from './ManageTime'
import ServiceManage from './ServiceManage'
const ManageCenterPage = () => {
  return (
    <div>
      <ManageTime />
      <ServiceManage />
    </div>
  )
}

export default ManageCenterPage
