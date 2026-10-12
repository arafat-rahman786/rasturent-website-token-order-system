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

tableBookOption?.addEventListener("click", () => {
  tableBookFormSection?.classList.remove("hidden")
  orderTypePlaceholder?.classList.add("hidden")
  parcelFormSection?.classList.add("hidden")
})

parcelOption?.addEventListener("click", () => {
  parcelFormSection?.classList.remove("hidden")
  orderTypePlaceholder?.classList.add("hidden")
})

tableBookForm?.addEventListener("submit", async (e) => {
  e.preventDefault()
  let formData = new FormData(tableBookForm as HTMLFormElement)
  let enter = Object.fromEntries(formData)
  let getData = localStorage.getItem('cart')
  let convert = getData ? JSON.parse(getData) : []
  
  const tokenRes = await api.get('/customerTokenInfomation')
  const tokenNumber = tokenRes.data.length + 1
   const estimatedMinutes = convert.reduce(
  (total: number, item: any) => {
    return total +
      Number(item.preparationTime) * item.quantity
  },
  0
)
  let update = {
    enter,
    data:convert,
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

 let getData = localStorage.getItem('cart')
  let convert = getData ? JSON.parse(getData) : []

  let total = convert.reduce((total: number, item: any) => {
    return total + item.priceValue * item.quantity
  }, 0)

  if (summarySubtotal) summarySubtotal.innerText = `৳ ${String(total)}`
  if (summaryGrandTotal) summaryGrandTotal.innerText = `৳ ${String(total)}`


  if (summaryItemCount) summaryItemCount.textContent = `${convert.length} items`
  const html = convert.map((item: any) => {
    return `
      <article class="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4">

        <img
          src="${item.imageSelect}"
          alt="${item.imageAlt}"
          class="h-20 w-20 rounded-xl object-cover"
        >

        <div class="flex-1">
          <h3 class="font-bold">
            ${item.productName}
          </h3>

          <p class="mt-1 text-sm text-gray-500">
            ${item.quantity} × ৳${item.priceValue}
          </p>

          <p class="mt-2 font-black">
            ৳${item.priceValue * item.quantity}
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

    const products = Object.values(token).filter(
      (item: any) =>
        item &&
        typeof item === "object" &&
        "priceValue" in item &&
        "quantity" in item
    )

   const totalPrice = products.reduce((total:number,item:any)=>{
    return total + item.priceValue * item.quantity
   },0)
   console.log(totalPrice);
 
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

async function tokenPage() {
  const tokenLocation = document.getElementById("token_location")
  let stroageData = localStorage.getItem('customerTokenInfomation')
  if (!stroageData) {
    console.log('stroge pai nai');
    return
  }
  let convertData = JSON.parse(stroageData)
  const localTokenNumber = convertData.tokenNumber
  const responsive = await api.get("customerTokenInfomation")
  const apiToken = responsive.data
  const matchToken = apiToken.find((item: any) => {
    return item.tokenNumber == localTokenNumber
  })
  tokenLocation?.setAttribute("href", `../../live-token.html?tokenId=${matchToken.id}`)
}

tokenPage()

const parcelLoader = document.getElementById("parcelLoader");
const loaderCountdown = document.getElementById("loaderCountdown");
const loaderProgress = document.getElementById("loaderProgress");

const parcelSuccess = document.getElementById("parcelSuccess");

const popupTokenId = document.getElementById("popupTokenId");
const popupName = document.getElementById("popupName");
const popupEmail = document.getElementById("popupEmail");
const popupPhone = document.getElementById("popupPhone");
const popupDistrict = document.getElementById("popupDistrict");
const popupAddress = document.getElementById("popupAddress");
const popupPayment = document.getElementById("popupPayment");
const popupTotal = document.getElementById("popupTotal");

const viewParcelToken = document.getElementById("viewParcelToken");
const closeParcelSuccess = document.getElementById("closeParcelSuccess");


function showParcelValue(
  element: HTMLElement | null,
  value: unknown
) {
  if (!element) return;

  const text = String(value ?? "").trim();

  element.textContent = text || "দেওয়া হয়নি";
}

// Close button
closeParcelSuccess?.addEventListener("click", () => {
  parcelSuccess?.classList.add("hidden");
  parcelSuccess?.classList.remove("flex");
});

// View Live Token button
viewParcelToken?.addEventListener("click", () => {
  const tokenId = popupTokenId?.textContent
    ?.trim()
    .replace(/^#/, "");

  if (!tokenId || tokenId === "---") {
    console.warn("Parcel Token ID পাওয়া যায়নি");
    return;
  }

  window.location.href =
    `./live-token.html?tokenId=${encodeURIComponent(tokenId)}`;
});

const parcelTokenForm = document.getElementById(
  "parcelTokenForm"
) as HTMLFormElement | null;

parcelTokenForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(parcelTokenForm);

    const enteris = Object.fromEntries(
      formData.entries()
    );

    let getData = localStorage.getItem('cart')
  let convert = getData ? JSON.parse(getData) : []

    if (!convert.length) {
      console.warn("Cart খালি আছে");
      return;
    }

    const processData = convert.map((item: any) => ({
      id: item.id,
      productName: item.productName,
      category: item.category,
      priceValue: Number(item.priceValue),
      quantity: Number(item.quantity),
    }));

    const parcelTokenData = {
      ...enteris,
      products: processData,
      orderCreatedAt: Date.now(),
    };

    const response = await api.post(
      "/customerDeliveryInfomation",
      parcelTokenData
    );


    const savedOrder = response.data;

    showParcelValue(popupTokenId, `#${savedOrder.id}`);
    showParcelValue(popupName, enteris.customerName);
    showParcelValue(popupEmail, enteris.email);
    showParcelValue(popupPhone, enteris.phone);
    showParcelValue(popupDistrict, enteris.district);
    showParcelValue(popupAddress, enteris.address);
    showParcelValue(popupPayment, enteris.paymentMethod);

    // Total amount
    const totalPrice = processData.reduce(
      (sum: number, item: any) =>
        sum + item.priceValue * item.quantity,
      0
    );

    showParcelValue(popupTotal, `৳${totalPrice}`);


    parcelLoader?.classList.remove("hidden");
    parcelLoader?.classList.add("flex");

    const duration = 5000;
    const startTime = Date.now();

    while (Date.now() - startTime < duration) {
      const elapsed = Date.now() - startTime;
      const remaining = duration - elapsed;

      if (loaderCountdown) {
        loaderCountdown.textContent = String(
          Math.ceil(remaining / 1000)
        );
      }

      if (loaderProgress) {
        (loaderProgress as HTMLDivElement).style.width =
          `${Math.min(100, (elapsed / duration) * 100)}%`;
      }

      await new Promise<void>((resolve) =>
        setTimeout(resolve, Math.min(100, remaining))
      );
    }

    // Loader বন্ধ
    parcelLoader?.classList.remove("flex");
    parcelLoader?.classList.add("hidden");

    // Success Popup দেখানো
    parcelSuccess?.classList.remove("hidden");
    parcelSuccess?.classList.add("flex");

    console.log("Parcel order তৈরি হয়েছে:", response.data);
  } catch (error) {
    console.error("Parcel order তৈরি করা যায়নি:", error);
  }
});



