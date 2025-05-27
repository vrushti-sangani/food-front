import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTotalPrice, removeItem } from '../../redux/slices/cartSlice'
import { enqueueSnackbar } from 'notistack';
// import { create } from '../../../../pos-backend/models/userModel';
import { addOrder, createOrderRazorpay, updateTable, verifyPaymentRazorpay } from '../../https';
import { useMutation } from "@tanstack/react-query";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}


const Bill = () => {

  const dispatch = useDispatch();

  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector(state => state.cart);
  const total = useSelector(getTotalPrice);
  const taxRate = 5.25;
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const [paymentMethod, setPaymentMethod] = useState();

  const handlePlaceOrder = async () => {
    if(!paymentMethod){
      enqueueSnackbar("Please select a payment method!", {variant: "warning"});

      return;
    }

    // load the script
    try {
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );

      if (!res) {
        enqueueSnackbar("Razorpay SDK failed to load. Are you online?", {
          variant: "warning",
        });
        return;
      }

      // create order
      const reqData = {
        amount: totalPriceWithTax.toFixed(2)
      } 

      const {data} = await createOrderRazorpay(reqData);

      const options = {
        key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "RESTRO",
        description: "Secure Payment for Your Meal",
        order_id: data.order.id,
        handler: async function (response) {
          const verification = await verifyPaymentRazorpay(response);
          console.log(verification);
          enqueueSnackbar(verification.data.message, { variant: "success" });

          // place the order
           const orderData = {
            customerDetails: {
              name: customerData.customerName,
              phone: customerData.customerPhone,
              guests: customerData.guests
            },
            orderStatus: "In progress",
            bills: {
              total: total,
              tax: tax,
              totalWithTax: totalPriceWithTax
            },
            items: cartData,
            table: customerData.table.tableId
           }

           setTimeout(() => {
            orderMutation.mutate(orderData);
           }, 1500);

        },
        prefill: {
          name: customerData.name,
          email: "",
          contact: customerData.phone,
        },
        theme: { color: "#025cca" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error);
      enqueueSnackbar("Payment Failed!", {
        variant: "error",
      });
    }
  };

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const{ data } = resData.data;
      console.log(data);

      // update table
      const tableData = {
        status: "Booked",
        orderId: data._id,
        tableId: data.table
      }

      setTimeout(() => {
        tableUpdateMutation.mutate(tableData)
      }, 1500);

      enqueueSnackbar("Order Placed!", {
        variant: "success",
      });
    },
    onError: (error) => {
      console.log(error);
    }
  })

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: (resData) => {
      console.log(resData);
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    }
  })

  return (
    <>
      <div className='flex items-center justify-between px-5 mt-2'>
        <p className='text-[15px] text-[#ababab] font-medium mt-1'>Items({cartData.lenght})</p>
        <h1 className='text-[#f5f5f5] text-md font-bold'>₹{total.toFixed(2)}</h1>
      </div>
      <div className='flex items-center justify-between px-5 mt12'>
        <p className='text-[15px] text-[#ababab] font-medium mt-1'>Tax(5.25%)</p>
        <h1 className='text-[#f5f5f5] text-md font-bold'>₹{tax.toFixed(2)}</h1>
      </div>
      <div className='flex items-center justify-between px-5 mt12'>
        <p className='text-[15px] text-[#ababab] font-medium mt-1'>Total With Tax</p>
        <h1 className='text-[#f5f5f5] text-md font-bold'>₹{totalPriceWithTax.toFixed(2)}</h1>
      </div>
      <div className='flex items-center gap-3 px-5 mt-3'>
        <button onClick={() => setPaymentMethod("Cash")} className={`bg-[#1f1f1f] px-4 py-2 w-full rounded-lg text-[#ababab] font-semibold ${paymentMethod === "Cash" ? "bg-[#383737]" : ""}`}>Cash</button>
        <button onClick={() => setPaymentMethod("Online")} className={`bg-[#1f1f1f] px-4 py-2 w-full rounded-lg text-[#ababab] font-semibold ${paymentMethod === "Online" ? "bg-[#383737]" : ""}`}>Online</button>
      </div>
      <div className='flex items-center gap-3 px-5 mt-4'>
        <button className='bg-[#025cca] text-[#f5f5f5] px-4 py-2 w-full rounded-lg text-lg font-semibold'>Print Receipt</button>
        <button onClick={handlePlaceOrder} className='bg-[#f6b100] px-4 py-2 w-full rounded-lg text-[#1f1f1f] text-lg font-semibold'>Place Order</button>
      </div>
    </>
  )
}

export default Bill

