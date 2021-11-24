import { inAppPurchase, Transaction } from 'electron'

const PRODUCT_ID = 'premium'

let callback: Function | null = null

inAppPurchase.on('transactions-updated', (event: any, transactions: Transaction[]) => {
  if (!Array.isArray(transactions)) {
    return
  }

  transactions.forEach(function (transaction) {
    const payment = transaction.payment

    switch (transaction.transactionState) {
      case 'purchasing':
        console.log(`Purchasing ${payment.productIdentifier}...`)
        break

      case 'purchased': {
        console.log(`${payment.productIdentifier} purchased.`)

        // Get the receipt url.
        const receiptURL = inAppPurchase.getReceiptURL()

        console.log(`Receipt URL: ${receiptURL}`)

        // Submit the receipt file to the server and check if it is valid.
        // @see https://developer.apple.com/library/content/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateRemotely.html
        // ...
        // ...

        callback && callback()
        callback = null

        inAppPurchase.finishTransactionByDate(transaction.transactionDate)

        break
      }

      case 'failed':

        console.log(`Failed to purchase ${payment.productIdentifier}.`)

        // Finish the transaction.
        inAppPurchase.finishTransactionByDate(transaction.transactionDate)

        break
      case 'restored':
        callback && callback()
        callback = null
        break
      case 'deferred':

        console.log(`The purchase of ${payment.productIdentifier} has been deferred.`)

        break
      default:
        break
    }
  })
})

export function purchase () {
  return new Promise((resolve, reject) => {
    if (!inAppPurchase.canMakePayments()) {
      reject(new Error('The user is not allowed to make in-app purchase.'))
      return
    }

    callback = resolve

    inAppPurchase.purchaseProduct(PRODUCT_ID, 1).then(isProductValid => {
      if (!isProductValid) {
        callback = null
        reject(new Error('The product is not valid.'))
      }
    })
  })
}

export function restore () {
  return new Promise<void>((resolve, reject) => {
    if (!inAppPurchase.canMakePayments()) {
      reject(new Error('The user is not allowed to make in-app purchase.'))
      return
    }

    const timer = setTimeout(() => {
      callback = null
      reject(new Error('Timeout'))
    }, 8000)

    callback = () => {
      clearTimeout(timer)
      callback = null
      resolve()
    }

    inAppPurchase.restoreCompletedTransactions()
  })
}

export function getProduct () {
  return inAppPurchase.getProducts([PRODUCT_ID])
}
