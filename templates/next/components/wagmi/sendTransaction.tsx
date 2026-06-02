import { SubmitEvent } from "react";
import { useWaitForTransactionReceipt, useSendTransaction, BaseError } from "wagmi";
import { Hex, parseEther } from "viem";

export function SendTransaction() {
  const { data: hash, error, isPending, mutate } = useSendTransaction()

  async function submit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const to = formData.get('address') as Hex
    const value = formData.get('value') as string
    mutate({ to, value: parseEther(value) })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  return (
    <div>
      <h2>Send Transaction</h2>
      <form onSubmit={submit}>
        <input name="address" placeholder="Address" required />
        <input
          name="value"
          placeholder="Amount (native token)"
          type="number"
          step="0.000000001"
          required
        />
        <button disabled={isPending} type="submit" className="card">
          {isPending ? 'Confirming...' : 'Send'}
        </button>
      </form>
      {hash && <div>Transaction Hash: {hash}</div>}
      {isConfirming && 'Waiting for confirmation...'}
      {isConfirmed && 'Transaction confirmed.'}
      {error && (
        <div>Error: {(error as BaseError).shortMessage || error.message}</div>
      )}
    </div>
  )
}