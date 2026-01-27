import GetTransactionByid from "@/components/hook/Transaction/GetTransactionByid";
import PaymentDetails from "@/components/PaymentInfo/PaymentDetails";
import RegisterPayment from "@/components/PaymentInfo/RegisterPayment";
import { useParams } from "react-router";

const TransactionById = () => {
    const {id} = useParams<{id: string}>();

  const {isPending, getTransactionByid} = GetTransactionByid({id: id!}) as {
    isPending: boolean;
    getTransactionByid: {
      data: {
        _id: string;
        companyName: string;
        name: string;
        paymentPlanType: string;
        updatedAt: Date;
        fineAmount?: number;
      };
    };  
  };


  return (
    <div>
        <div>
        {isPending ? (
            <p>Loading transaction details...</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>
            <div className="grid grid-cols-3">
<p><strong>Company Name:</strong> {getTransactionByid?.data?.companyName}</p>
            <p><strong>Transaction Name:</strong> {getTransactionByid?.data?.name}</p>
            <p><strong>Payment Plan Type:</strong> {getTransactionByid?.data?.paymentPlanType}</p>
            <p><strong>Updated At:</strong> {new Date(getTransactionByid?.data?.updatedAt).toLocaleDateString()}</p>
            <p><strong>Fine Amount:</strong> ₹ {getTransactionByid?.data?.fineAmount?.toLocaleString("en-IN") || 0}</p>
            </div>
            
          </>)}
        </div>
        
        <RegisterPayment/>
        <h1 className="mt-5 mb-5">View Transaction</h1>
        <PaymentDetails/>
    </div>
  )
}

export default TransactionById