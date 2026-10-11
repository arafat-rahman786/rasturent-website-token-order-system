import api from "../../lib/api";

let parcelOption = document.getElementById("parcelOption")
let tableBookOption = document.getElementById("tableBookOption")
let tableBookFormSection = document.getElementById("tableBookFormSection")
let parcelFormSection = document.getElementById("parcelFormSection")
let orderTypePlaceholder = document.getElementById("orderTypePlaceholder")
let tableBookForm = document.getElementById("tableBookForm")
let summaryItemCount = document.getElementById("summaryItemCount")
let summarySubtotal = document.getElementById("summarySubtotal")
let summaryGrandTotal = document.getElementById("summaryGrandTotal")

tableBookOption?.addEventListener("click",()=>{
    tableBookFormSection?.classList.remove("hidden")
    orderTypePlaceholder?.classList.add("hidden")
    parcelFormSection?.classList.add("hidden")
})

parcelOption?.addEventListener("click",()=>{
    parcelFormSection?.classList.remove("hidden")
    orderTypePlaceholder?.classList.add("hidden")
})

tableBookForm?.addEventListener("submit",async(e)=>{
  e.preventDefault()
  let formData = new FormData(tableBookForm as HTMLFormElement)
  let enter = Object.fromEntries(formData)
  let res = await api.get('/carts')
  let data = res.data
  const tokenRes = await api.get('/customerTokenInfomation')
  const tokenNumber = tokenRes.data.length + 1
  const estimatedMinutes = data.reduce(
  (total: number, item: any) => {
    return total +
      Number(item.existing.preparationTime) * item.quantity
  },
  0
)
  let update = {
  enter,
    data,
    tokenNumber,
    orderCreatedAt: Date.now(),
    estimatedMinutes
  }

  try {
    const response = await api.post(
      '/customerTokenInfomation',
      update
    )

    localStorage.setItem("customerTokenInfomation", JSON.stringify(update))
    const tokenId = response.data.id

    window.location.href =
      `../../live-token.html?tokenId=${tokenId}`
  } catch (error) {
    console.error("Token তৈরি করা যায়নি", error)
  }
})



const tokenOrderItems = document.getElementById(
  'tokenOrderItems'
) as HTMLDivElement | null

async function tokenCartRender() {
  if (!tokenOrderItems) return

  const res = await api.get('/carts')
  const data = res.data

  let total = data.reduce((total:number,item:any)=>{
    return total + item.existing.priceValue * item.quantity
  },0)

 if (summarySubtotal) summarySubtotal.innerText =`৳ ${String(total)}`
 if (summaryGrandTotal) summaryGrandTotal.innerText =`৳ ${String(total)}`


 if (summaryItemCount) summaryItemCount.textContent = `${data.length} items`
  const html = data.map((item: any) => {
    return `
      <article class="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4">

        <img
          src="${item.existing.imageSelect}"
          alt="${item.existing.imageAlt}"
          class="h-20 w-20 rounded-xl object-cover"
        >

        <div class="flex-1">
          <h3 class="font-bold">
            ${item.existing.productName}
          </h3>

          <p class="mt-1 text-sm text-gray-500">
            ${item.quantity} × ৳${item.existing.priceValue}
          </p>

          <p class="mt-2 font-black">
            ৳${item.existing.priceValue * item.quantity}
          </p>
        </div>

      </article>
    `
  }).join('')

  tokenOrderItems.innerHTML = html
}

tokenCartRender()


const simpleToken = document.getElementById(
  "simpleToken"
) as HTMLParagraphElement

const tokenTimer = document.getElementById(
  "tokenTimer"
) as HTMLParagraphElement

const tokenPrice = document.getElementById("price")
 
async function helping() {
  const params = new URLSearchParams(
    window.location.search
  )

  const tokenId = params.get("tokenId")

  if (!tokenId) {
    console.warn("Token ID পাওয়া যায়নি")
    return
  }

  try {
    const res = await api.get(
      `/customerTokenInfomation/${tokenId}`
    )

    const token = res.data

    const totalPrice = token.data.reduce(
      (sum: number, item: any) => sum + item.existing.priceValue * item.quantity,
      0
    )

    if (tokenPrice) {
      tokenPrice.textContent = `৳ ${String(totalPrice)}`
    }

    simpleToken.textContent =
      `#${String(token.tokenNumber).padStart(3, "0")}`

    const finishTime =
      token.orderCreatedAt +
      token.estimatedMinutes * 60 * 1000

    async function updateTimer() {
      const remaining = Math.max(
        0,
        finishTime - Date.now()
      )

      const minutes = Math.floor(remaining / 60000)
      const seconds = Math.floor(
        (remaining % 60000) / 1000
      )

      tokenTimer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

      if (remaining <= 0) {
        clearInterval(timerInterval)
        tokenTimer.textContent = "Order Ready!"
      }
    }

    updateTimer()

    const timerInterval = setInterval(
      updateTimer,
      1000
    )

    console.log(token)
  } catch (error) {
    console.warn("Token information পাওয়া যায়নি", error)
  }
}

helping()

async function tokenPage (){
    const tokenLocation = document.getElementById("token_location")
    let stroageData = localStorage.getItem('customerTokenInfomation')
    if(!stroageData){
      console.log('stroge pai nai');
      return
    }
    let convertData = JSON.parse(stroageData)
    const localTokenNumber = convertData.tokenNumber
    const responsive = await api.get("customerTokenInfomation")
    const apiToken = responsive.data
   const matchToken = apiToken.find((item:any)=>{
    return item.tokenNumber == localTokenNumber
   })
    tokenLocation?.setAttribute("href", `../../live-token.html?tokenId=${matchToken.id}`)
}

tokenPage()

