import React, { Component } from 'react'
import axios from 'axios'

class RazorPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderID: '',
      cartId: '',
      addressId: -1,
    }
  }
  RequestOrderPayment = () => {
    const { amount, addressId, cartId, jwt } = this.props
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/order/buy-now`,
        {
          addressId,
          cartId,
        },
        {
          headers: {
            Authorization: `${jwt}`,
          },
        },
      )
      .then(response => {
        console.log(response)
        this.setState({
          orderID: response.data.data.razorPayOrderId,
        })
        var options = {
          key_id: process.env.RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
          amount: response.data.data.totalPrice * 100,
          currency: 'INR',
          name: 'FROZIT',
          description: 'Cart Buy',
          order_id: this.state.orderID,
          handler: function (response) {
            alert(response.razorpay_payment_id)
            alert(response.razorpay_order_id)
            alert(response.razorpay_signature)
          },
          prefill: {
            name: '',
            email: '',
            contact: '',
          },
          notes: {
            address: 'note',
          },
          theme: {
            color: '#F37254',
          },
        }
        var rzp1 = new window.Razorpay(options)
        rzp1.open()
      })
  }
  render() {
    return (
      <div>
        <button id="rzp-button1" onClick={() => this.RequestOrderPayment()}>
          Pay Now
        </button>
      </div>
    )
  }
}
export default RazorPanel
