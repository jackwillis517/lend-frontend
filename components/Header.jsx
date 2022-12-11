import { ConnectButton } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "@web3uikit/core"

export default function Header(){
    const { chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const lendAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [userWorthiness, setUserWorthiness] = useState(0)
    const [donation, setDonation] = useState(0)
    const [JtokenBalance, setJtokenBalance] = useState(0)
    const [LendJtokenBalance, setLendJtokenBalance] = useState(0)
    const [providedLiquidity, setProvidedLiquidity] = useState(0)
    const [borrowAmountCheck, setBorrowAmountCheck] = useState(0)
    const [projectedDebt, setProjectedDebt] = useState(0)
    const [projectedCollateral, setProjectedCollateral] = useState(0)
    const [borrowAmount, setBorrowAmount] = useState(0)
    const [collateralAmount, setCollateralAmount] = useState(0)
    const [paymentAmount, setPaymentAmount] = useState(0)
    const dispatch = useNotification()


    //----------------------------------Contract Functions--------------------------------//
    const {runContractFunction: addNewBorrower} = useWeb3Contract ({
        abi: abi,
        contractAddress: lendAddress,
        functionName: "addNewBorrower",
        params: {}
    })

    const {runContractFunction: viewWorthiness} = useWeb3Contract ({
        abi: abi,
        contractAddress: lendAddress,
        functionName: "viewWorthiness",
        params: {}
    })

    const {runContractFunction: viewJtokenBalance} = useWeb3Contract ({
        abi: abi,
        contractAddress: lendAddress,
        functionName: "viewJtokenBalance",
        params: {}
    })

    const {runContractFunction: viewLendJtokenBalance} = useWeb3Contract ({
        abi: abi,
        contractAddress: lendAddress,
        functionName: "viewContractBalance",
        params: {}
    })

    const {runContractFunction: fundContract} = useWeb3Contract ({
        abi: abi,
        contractAddress: lendAddress,
        functionName: "fundContract",
        params: {},
        msgValue: donation 
    })

    const {runContractFunction: provideLiquidity} = useWeb3Contract ({
        abi: abi,
        contractAddress: lendAddress,
        functionName: "provideLiquidity",
        params: {},
        msgValue: providedLiquidity
    })

    const {runContractFunction: claimInterest} = useWeb3Contract ({
        abi: abi,
        contractAddress: lendAddress,
        functionName: "claimInterest",
        params: {}
    })

    const {runContractFunction: checkBorrowDebt} = useWeb3Contract ({
        abi: abi,
        contractAddress: lendAddress,
        functionName: "checkBorrowDebt",
        params: {
            amount: borrowAmountCheck
        }
    })

    const {runContractFunction: checkBorrowCollateral} = useWeb3Contract ({
        abi: abi,
        contractAddress: lendAddress,
        functionName: "checkBorrowCollateral",
        params: {
            amount: borrowAmountCheck
        }
    })

    const {runContractFunction: borrowLiquidity} = useWeb3Contract ({
        abi: abi,
        contractAddress: lendAddress,
        functionName: "borrowLiquidity",
        params: {
            amount: borrowAmount
        },
        msgValue: collateralAmount 
    })

    const {runContractFunction: makePayment} = useWeb3Contract ({
        abi: abi,
        contractAddress: lendAddress,
        functionName: "makePayment",
        params: {},
        msgValue: paymentAmount 
    })

    const {runContractFunction: removeUser} = useWeb3Contract ({
        abi: abi,
        contractAddress: lendAddress,
        functionName: "removeUser",
        params: {}
    })
    
    //----------------------------------------------------------------------------------//



    //-------------------------------Notification Handlers------------------------------//
    const handleError = async function (tx){
        handleErrorNotification(tx)
    }

    const handleErrorNotification = function () {
        dispatch({
            type: "error",
            message: "Error",
            title: "That Didn't Work :(",
            position: "topR",
        })
    }

    const handleAddNewBorrowerSuccess = async function (tx){
        await tx.wait(1)
        handleAddNewBorrowerSuccessNotification(tx)
    }
    
    const handleAddNewBorrowerSuccessNotification = function () {
        dispatch({
            type: "success",
            message: "Borrower Added!",
            title: "Notification",
            position: "topR",
        })
    }

    const handleProvideLiquiditySuccess = async function (tx){
        await tx.wait(1)
        handleProvideLiquiditySuccessNotification(tx)
    }
    
    const handleProvideLiquiditySuccessNotification = function () {
        dispatch({
            type: "success",
            message: "Thank you Lender! You can claim your intrest in one minute :)",
            title: "Notification",
            position: "topR",
        })
    }

    const handleFundContractSuccess = async function (tx){
        await tx.wait(1)
        handleFundContractSuccessNotification(tx)
    }
    
    const handleFundContractSuccessNotification = function () {
        dispatch({
            type: "success",
            message: "Thank you for your donation!",
            title: "Notification",
            position: "topR",
        })
    }

    const handleClaimInterestSuccess = async function (tx){
        await tx.wait(1)
        handleClaimInterestSuccessNotification(tx)
    }
    
    const handleClaimInterestSuccessNotification = function () {
        dispatch({
            type: "success",
            message: "Intrest Claimed!",
            title: "Notification",
            position: "topR",
        })
    }

    const handleBorrowLiquiditySuccess = async function (tx){
        await tx.wait(1)
        handleBorrowLiquiditySuccessNotification(tx)
    }
    
    const handleBorrowLiquiditySuccessNotification = function () {
        dispatch({
            type: "success",
            message: "Ether Borrowed!",
            title: "Notification",
            position: "topR",
        })
    }

    const handleMakePaymentSuccess = async function (tx){
        await tx.wait(1)
        handleMakePaymentSuccessNotification(tx)
    }
    
    const handleMakePaymentSuccessNotification = function () {
        dispatch({
            type: "success",
            message: "Payment Made!",
            title: "Notification",
            position: "topR",
        })
    }
    //----------------------------------------------------------------------------------//



    //----------------------------------Call Handlers--------------------------------//

    const addNewBorrowerHandler = async (e) => {
        e.preventDefault()
        await addNewBorrower({
           onSuccess: handleAddNewBorrowerSuccess,
           onError: handleError
        })
    }

    const viewWorthinessHandler = async (e) => {
        e.preventDefault()
        if(typeof window != "undefined") {
            const worthiness = await viewWorthiness({
                onError: handleError
             })
            setUserWorthiness(worthiness)
        }    
    }

    const viewJtokenBalanceHandler = async (e) => {
        e.preventDefault()
        if(typeof window != "undefined") {
            const JtokenBalance = await viewJtokenBalance({
                onError: handleError
             })
             setJtokenBalance(JtokenBalance)
        }    
    }

    const viewLendJtokenBalanceHandler = async (e) => {
        e.preventDefault()
        if(typeof window != "undefined") {
            const LendJtokenBalance = await viewLendJtokenBalance({
                onError: handleError
             })
             setLendJtokenBalance(LendJtokenBalance)
        }    
    }

    const fundContractHandler = async (e) => {
        e.preventDefault()
        setDonation(document.getElementById("donationInput").value * 1e18)
        await fundContract({
           onSuccess: handleFundContractSuccess,
           onError: handleError
        })
    }

    const provideLiquidityHandler = async (e) => {
        e.preventDefault()
        setProvidedLiquidity(document.getElementById("liquidityInput").value * 1e18)
        await provideLiquidity({
           onSuccess: handleProvideLiquiditySuccess,
           onError: handleError
        })
    }

    const claimInterestHandler = async (e) => {
        e.preventDefault()
        await claimInterest({
           onSuccess: handleClaimInterestSuccess,
           onError: handleError
        })
    }

    const checkBorrowDebtHandler = async (e) => {
        e.preventDefault()
        setBorrowAmountCheck(document.getElementById("checkBorrowInput").value)
        const checkBorrowDebtReturn = await checkBorrowDebt({
           onError: handleError
        })
        setProjectedDebt(checkBorrowDebtReturn / parseFloat(1000))
    }

    const checkBorrowCollateralHandler = async (e) => {
        e.preventDefault()
        setBorrowAmountCheck(document.getElementById("checkBorrowInput").value)
        const checkBorrowCollateralReturn = await checkBorrowCollateral({
           onError: handleError
        })
        setProjectedCollateral(checkBorrowCollateralReturn / 1000)
    }

    const borrowLiquidityHandler = async (e) => {
        e.preventDefault()
        setBorrowAmount(document.getElementById("borrowInput").value)
        console.log(borrowAmount)
        setCollateralAmount(document.getElementById("collateralInput").value * 1e18)
        console.log(collateralAmount)
        await borrowLiquidity({
           onSuccess: handleBorrowLiquiditySuccess,
           onError: handleError
        })
    }

    const makePaymentHandler = async (e) => {
        e.preventDefault()
        setPaymentAmount(document.getElementById("amountInput").value * 1e18)
        console.log(paymentAmount)
        await makePayment({
           onSuccess: handleMakePaymentSuccess,
           onError: handleError
        })
    }

    const removeUserHandler = async (e) => {
        e.preventDefault()
        await removeUser({
           onSuccess: handleMakePaymentSuccess,
           onError: handleError
        })
    }
    //----------------------------------------------------------------------------------//



    //----------------------------------------HTML--------------------------------------//
    return(
        <div>
            <h1>Lend</h1>
            <ConnectButton/>
            <br/>
            <br/>
            <br/>
            <h1>Register as a Borrower & Check Your Worthiness Score</h1>
            {lendAddress ? (
                <button type="generic" id="addBorrowerButton" onClick={addNewBorrowerHandler}>
                Add New Borrower
            </button>
            ) : (
                <div>No Lend Address Detected</div>
            )}
            <br/>
            <button type="generic" id="viewWorthinessButton" onClick={viewWorthinessHandler}>
                View Your Worthiness 
            </button>
            <h1>{`Worthiness: ${userWorthiness}`}</h1>
            <br/>
            <br/>
            <br/>
            <h1>Donate to Lend</h1>    
            <form onSubmit={fundContractHandler}>
                <div>
                    <label>Please Donate to The Protocal</label>
                    <br/>
                    <input type="number" id="donationInput" placeholder=".02"  step=".01"/>
                </div>
                <div>
                    <button type="submit">Make donation</button>
                </div>
            </form>
            <br/>
            <br/>
            <br/>
            <h1>Become a Lender</h1>
            <form onSubmit={provideLiquidityHandler}>
                <div>
                    <label>Lend Ether</label>
                    <br/>
                    <input type="number" id="liquidityInput" placeholder=".013"  step=".01"/>
                </div>
                <div>
                    <button type="submit">Lend</button>
                </div>
            </form>
            <br/>
            <button type="generic" id="viewJtokenBalanceButton" onClick={viewJtokenBalanceHandler}>
                View Your Jtoken Balance  
            </button>
            <h3>{`Jtoken Balance: ${JtokenBalance}`}</h3>
            <br/>
            <button type="generic" id="viewLendJtokenBalanceButton" onClick={viewLendJtokenBalanceHandler}>
                View Lends Jtoken Balance  
            </button>
            <h3>{`Lends Jtoken Balance: ${LendJtokenBalance}`}</h3>
            <br/>
            <button type="generic" id="claimIntrestButton" onClick={claimInterestHandler}>
                Claim Interest 
            </button>
            <br/>
            <br/>
            <br/>
            <br/>
            <h1>Lock in Debt Obligations</h1>
            <form>
                <div>
                    <label>Check Projected Debt & Collateral for Borrowing This Amount:</label>
                    <br/>
                    <input type="number" id="checkBorrowInput" placeholder=".01"  step=".01"/>
                </div>
                <div>
                    <button type="submit" onClick={checkBorrowDebtHandler}>Check Projected Debt</button>
                    <button type="submit" onClick={checkBorrowCollateralHandler}>Check Projected Collateral</button>
                </div>
            </form>
            <br/>
            <h3>{`Projected Debt: ${projectedDebt}`}</h3>
            <h3>{`Projected Collateral: ${projectedCollateral}`}</h3>
            <br/>
            <h1>Borrow Ethereum</h1>
            <h2>Please Ensure to Lock in Your Debt Obligations Above Before Borrowing</h2>
            <form onSubmit={borrowLiquidityHandler}>
                <div>
                    <label>Amount You Want to Borrow</label>
                    <br/>
                    <input type="number" id="borrowInput" placeholder=".01"  step=".01"/>
                    <br/>
                    <br/>
                    <label>Amount of Required Collateral</label>
                    <br/>
                    <input type="number" id="collateralInput" placeholder=".02"  step=".01"/>
                </div>
                <div>
                    <button type="submit">Borrow</button>
                </div>
            </form>
            <br/>
            <br/>
            <br/>
            <br/>
            <h1>Pay Back a Loan</h1>
            <h2>Please Ensure to Check Your Loan Expiration Date to Make Timely Payments</h2>
            <form onSubmit={makePaymentHandler}>
                <div>
                    <label>Payment Amount</label>
                    <br/>
                    <input type="number" id="amountInput" placeholder=".02"  step=".01"/>
                </div>
                <div>
                    <button type="submit">Make Payment</button>
                </div>
            </form>
            <br/>
            <br/>
            <br/>
            <button type="submit" onClick={removeUserHandler}>Remove User</button>
            <br/>
            <br/>
            {/* <h1>{`Projected Collateral: ${projectedCollateral}`}</h1> */}
        </div>
    )
     //----------------------------------------------------------------------------------//
}