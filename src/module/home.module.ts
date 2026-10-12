import api from '../../lib/api'

type Product = {
  id: string | number
  productId: string
  productName: string
  heroLabel: string
  category: string
  description: string
  imageSelect: string
  imageAlt: string
  badgeText: string
  badgeStyle: string
  heroLevel: string
  ratingValue: number
  miniCategory: string
  priceValue: number
  buttonText: string
  buttonDest: string
  buttonSize: string
  buttonColor: string
  productStatus: string
  imageDisplay: string
  preparationTime: string | number
}



const menuEditorForm = document.getElementById(
  'menuEditorForm'
) as HTMLFormElement | null

const menu_body = document.getElementById(
  'menu_body'
) as HTMLDivElement | null

// Preview elements
const previewCardImage = document.getElementById(
  'previewCardImage'
) as HTMLImageElement | null

const previewCardBadge = document.getElementById(
  'previewCardBadge'
) as HTMLDivElement | null

const previewCardRating = document.getElementById(
  'previewCardRating'
) as HTMLDivElement | null

const previewCardHero = document.getElementById(
  'previewCardHero'
) as HTMLElement | null

const previewCardPreparation = document.getElementById('previewCardPreparation') as HTMLElement | null

const previewCardTitle = document.getElementById(
  'previewCardTitle'
) as HTMLElement | null

const previewCardDesc = document.getElementById(
  'previewCardDesc'
) as HTMLElement | null

const previewCardPrice = document.getElementById(
  'previewCardPrice'
) as HTMLElement | null

const previewBtnText = document.getElementById(
  'previewBtnText'
) as HTMLElement | null

// Additional preview elements
const previewCardCategory = document.getElementById(
  'previewCardCategory'
) as HTMLElement | null

const previewCardMiniCategory = document.getElementById(
  'previewCardMiniCategory'
) as HTMLElement | null

const previewCardHeat = document.getElementById(
  'previewCardHeat'
) as HTMLElement | null

const previewCardButton = document.getElementById(
  'previewCardButton'
) as HTMLAnchorElement | null

// ===============================
// LIVE PREVIEW
// ===============================

function updatePreview() {
  if (!menuEditorForm) return

  const formData = new FormData(menuEditorForm)

  const getValue = (name: string): string => {
    return String(formData.get(name) ?? '').trim()
  }

  const imageSelect = getValue('imageSelect')
  const badgeText = getValue('badgeText')
  const ratingValue = getValue('ratingValue')
  const heroLabel = getValue('heroLabel')
  const heroLevel = getValue('heroLevel')
  const productName = getValue('productName')
  const description = getValue('description')
  const priceValue = getValue('priceValue')
  const buttonText = getValue('buttonText')
  const buttonDest = getValue('buttonDest')
  const category = getValue('category')
  const miniCategory = getValue('miniCategory')
  const imageAlt = getValue('imageAlt')
  const preparetionTime = getValue('preparationTime')

  if (previewCardImage && imageSelect) {
    previewCardImage.src = imageSelect
    previewCardImage.alt = imageAlt || productName
  }

  if (previewCardBadge) {
    previewCardBadge.textContent = badgeText || 'Special'
  }

  if (previewCardRating) {
    previewCardRating.textContent = ratingValue || '5.0'
  }

  if (previewCardHero) {
    previewCardHero.textContent = heroLabel || 'Signature'
  }

  if (previewCardTitle) {
    previewCardTitle.textContent = productName || 'Product Name'
  }

  if (previewCardDesc) {
    previewCardDesc.textContent =
      description || 'Your product description will appear here.'
  }

  if (previewCardPrice) {
    previewCardPrice.textContent = `৳${priceValue || '0'}`
  }

  if (previewBtnText) {
    previewBtnText.textContent = buttonText || 'Add to Cart'
  }

  if (previewCardCategory) {
    previewCardCategory.textContent = category || 'Category'
  }

  if (previewCardPreparation) {
    previewCardPreparation.textContent = `${preparetionTime || '15-20'} min`
  }

  if (previewCardMiniCategory) {
    previewCardMiniCategory.textContent =
      miniCategory || 'Featured'
  }

  if (previewCardHeat) {
    previewCardHeat.textContent = heroLevel || 'Normal'
  }

 
if (previewCardButton) {
  previewCardButton.href = buttonDest || '#contact'

  // Form-এর display name থেকে valid CSS class তৈরি
  const colorMap: Record<string, string> = {
    'Amber Gold': 'bg-[#f5a900]',
    'Dark Charcoal': 'bg-[#333333]',
    'Black': 'bg-black',
    'Red': 'bg-red-500',
    'Emerald': 'bg-emerald-500',
  }

  const sizeMap: Record<string, string> = {
    'Small': 'px-3 text-xs',
    'Medium': 'px-4 text-sm',
    'Large': 'px-6 text-base',
  }

  const rawColor = getValue('buttonColor')
  const rawSize = getValue('buttonSize')

  const buttonColor = colorMap[rawColor] || 'bg-[#f5a900]'
  const buttonSize = sizeMap[rawSize] || 'px-4 text-sm'

  previewCardButton.classList.remove(
    'bg-[#f5a900]',
    'bg-[#333333]',
    'bg-black',
    'bg-red-500',
    'bg-emerald-500',
    'text-white',
    'text-[#181818]',
    'px-3',
    'px-4',
    'px-6',
    'text-xs',
    'text-sm',
    'text-base'
  )

  previewCardButton.classList.add(buttonColor)

  // Size-এর class-গুলো আলাদা করে যোগ করা
  buttonSize.split(' ').forEach((className) => {
    previewCardButton.classList.add(className)
  })

  previewCardButton.classList.add('text-[#181818]')
}

if (previewCardBadge) {
    const badgeStyle = getValue('badgeStyle')

    const styleMap: Record<string, string> = {
      'Red / Danger': 'bg-red-500',
      'Orange': 'bg-orange-500',
      'Amber Gold': 'bg-amber-500',
      'Emerald': 'bg-emerald-500',
      'Black': 'bg-black',
}

const badgeClass = styleMap[badgeStyle] || 'bg-red-500'

previewCardBadge.classList.remove(
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-emerald-500',
      'bg-black'
)

previewCardBadge.classList.add(badgeClass)
}

}


menuEditorForm?.addEventListener('input', updatePreview)
menuEditorForm?.addEventListener('change', updatePreview)

menuEditorForm?.addEventListener('submit', async (e) => {
  e.preventDefault()

  try {
    const formData = new FormData(menuEditorForm)

    const enter = Object.fromEntries(formData.entries())

    await api.post('/cartProducts', enter)

    await helpingRander()

    menuEditorForm.reset()
    updatePreview()
    dasboadSection()
    console.log('Product saved successfully!')
  } catch (error) {
    console.error('Product save error:', error)
  }
})



async function helpingRander() {
  if (!menu_body) {
    console.error('menu_body element not found!')
    return
  }

  try {
    const res = await api.get('/cartProducts')

    const data: Product[] = res.data

    const html = data
      .filter((item) => item.productStatus !== 'hidden')
      .map((item) => {
        const badgeClass = item.badgeStyle || 'bg-red-500'
        const buttonClass = item.buttonColor || 'bg-[#f5a900]'
        const buttonSize = item.buttonSize || 'px-4'

        return `
          <article id="${item.id}"
            class="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-950/10"
          >

            <div class="relative h-44 overflow-hidden bg-[#e9e2d8] sm:h-64">

              <img
                src="${item.imageSelect}"
                alt="${item.imageAlt}"
                class="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />

              <div
                class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10"
              ></div>

              <span
                class="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full ${badgeClass} px-4 py-2 text-xs font-extrabold text-white shadow-lg"
              >
                <i class="fa-solid fa-pepper-hot"></i>
                ${item.badgeText}
              </span>

              <span data-wish-id='${item.id}'
                class="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/90 text-gray-700 shadow-lg backdrop-blur transition group-hover:bg-[#f5a900] group-hover:text-[#181818]"
              >
                <i class="fa-regular fa-heart"></i>
              </span>

              <div
                class="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3"
              >
                <div>
                  <p class="text-xs font-bold uppercase tracking-[0.16em] text-white/80">
                    Heat Level: ${item.heroLevel}
                  </p>

                  <p class="mt-1 text-2xl font-black text-white">
                    ${item.heroLabel}
                  </p>
                </div>

                <span
                  class="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-extrabold text-[#181818] shadow-lg"
                >
                  <i class="fa-solid fa-star text-amber-400"></i>
                  ${item.ratingValue}
                </span>
              </div>
            </div>

            <div class="flex flex-1 flex-col p-5">

              <div class="flex items-center justify-between gap-3">
                <span class="text-xs font-bold uppercase tracking-[0.16em] text-[#b67b00]">
                  ${item.category}
                </span>

                <span class="rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold text-red-600">
                  ${item.miniCategory}
                </span>
              </div>

              <h3 class="mt-3 text-xl font-extrabold text-[#181818]">
                ${item.productName}
              </h3>

              <p class="mt-2 text-sm leading-6 text-gray-500">
                ${item.description}
              </p>

              <div class="mt-auto flex items-center justify-between gap-3 border-t border-gray-100 pt-5">

                <div>
                  <p class="text-xs font-medium text-gray-400">
                    Starting from
                  </p>

                  <p class="mt-1 text-2xl font-black text-[#181818]">
                    ৳${item.priceValue}
                  </p>
                </div>

                <a data-add-id="${item.id}"
                  href="${item.buttonDest || '#contact'}"
                  aria-label="Order ${item.productName}"
                  class="CartBtn inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl ${buttonClass} ${buttonSize} text-xs font-extrabold text-[#181818] transition hover:bg-[#181818] hover:text-white"
                >
                  <i class="fa-solid fa-plus"></i>
                  ${item.buttonText || 'Add to Cart'}
                </a>

              </div>
            </div>
          </article>
        `
      })

    menu_body.innerHTML = html.join('')

  } catch (error) {
    console.error('Product rendering error:', error)

    menu_body.innerHTML = `
      <p class="col-span-full rounded-xl bg-red-50 p-5 text-center text-red-600">
        Products load korte problem hocche. Browser console check koro.
      </p>
    `
  }
}


updatePreview()
helpingRander()


const cartSpen = document.getElementById('cartSpen')
let cartOpen = document.getElementById("cartOpen") as HTMLAnchorElement
let cartOverlay = document.getElementById('cartOverlay')
let cartPopup = document.getElementById('cartPopup')
let closeCartBtn = document.getElementById('closeCartBtn')
let cartItems = document.getElementById('cartItems')
cartOpen?.addEventListener("click", (e) => {
  e.preventDefault()
  cartOverlay?.classList.remove("hidden")
  cartPopup?.classList.remove("translate-x-full")
  renderCart()
})
closeCartBtn?.addEventListener("click", (e) => {
  e.preventDefault()

  cartOverlay?.classList.add("hidden")
  cartPopup?.classList.add("translate-x-full")
})

let cartTotal = document.getElementById('cartTotal')
let cartItemCount = document.getElementById('cartItemCount')
menu_body?.addEventListener('click', async (e) => {
  e.preventDefault()
  if (!(e.target instanceof Element)) return

  const findBtn = e.target.closest<HTMLElement>('[data-add-id]')
  if (!findBtn) return

  const productId = findBtn.dataset.addId
  if (!productId) return

 try {
  const getData = await api.get(`/cartProducts/${productId}`)
  const precess = getData.data
  const localData = localStorage.getItem('cart')
  const dataConvert = localData ? JSON.parse(localData) : []
  const existingProduct = dataConvert.find((item: any) => {
    return String(item.id) === String(productId)
  })
  if (existingProduct) {
    existingProduct.quantity += 1
  } else {
    dataConvert.push({
      ...precess,
      quantity: 1
    })
  }
  localStorage.setItem('cart', JSON.stringify(dataConvert))

} catch (error) {
  console.error(error)
  alert('there is error')
}
rendering()
})

function rendering(){
  const localData = localStorage.getItem('cart')
  const dataConvert = localData ? JSON.parse(localData) : []
 renderCart()
console.log('data convert:', dataConvert)
}

function renderCart() {
  try {
    const localData = localStorage.getItem('cart')
    const cart = localData ? JSON.parse(localData) : []

    const totalQuantity = cart.reduce(
      (total: number, item: any) => total + Number(item.quantity || 0),
      0
    )

    if (cartSpen) {
      cartSpen.textContent = String(cart.length)
    }

    if (cartItemCount) {
      cartItemCount.textContent = String(totalQuantity)
    }
    const subtotal = cart.reduce(
      (total: number, item: any) =>
        total + Number(item.priceValue) * Number(item.quantity || 0),
      0
    )

    if (cartTotal) {
      cartTotal.textContent = String(subtotal)
    }
    const cartPageRander = cart.map((item: any) => {
      return `
        <article
          data-cart-id="${item.id}"
          class="group relative flex gap-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-amber-200 hover:shadow-md"
        >
          <div class="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32">
            <img
              data-product-image
              src="${item.imageSelect}"
              alt="${item.imageAlt || item.productName}"
              class="h-full w-full object-cover"
            />

            <span class="absolute left-2 top-2 rounded-md bg-amber-500 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-gray-950">
              ${item.badgeText ?? ''}
            </span>
          </div>

          <div class="flex min-w-0 flex-1 flex-col">
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-sm font-extrabold text-gray-900 sm:text-base">
                ${item.productName}
              </h3>

              <button type="button" data-remove-id="${item.id}"
                class="shrink-0 rounded-lg p-1.5 text-gray-400 hover:text-red-500">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>

            <p class="mt-1 text-xs text-gray-500">
              প্রতি পিস ৳${item.priceValue}
            </p>

            <div class="mt-auto flex items-end justify-between gap-2 pt-3">
              <div class="flex h-9 items-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                <button type="button" data-decrease-id="${item.id}"
                  class="flex h-7 w-7 items-center justify-center">
                  <i class="fa-solid fa-minus"></i>
                </button>

                <span class="min-w-8 px-1 text-center text-sm font-extrabold">
                  ${item.quantity}
                </span>

                <button type="button" data-increase-id="${item.id}"
                  class="flex h-7 w-7 items-center justify-center">
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>

              <div class="text-right">
                <p class="text-[10px] text-gray-400">মোট দাম</p>
                <p class="text-base font-black text-gray-900">
                  ৳${Number(item.priceValue) * Number(item.quantity)}
                </p>
              </div>
            </div>
          </div>
        </article>
      `
    }).join('')


    if (cartItems) {
      cartItems.innerHTML = cartPageRander
    }


    const tokenOrderItems = document.getElementById('tokenOrderItems')

    if (tokenOrderItems) {
      tokenOrderItems.innerHTML = cartPageRander
    }

  } catch (error) {
    console.error('Cart rendering error:', error)
  }
}

renderCart()


cartItems?.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;
  const removeBtn = target.closest("[data-remove-id]") as HTMLElement | null;
  if (!removeBtn) return;
  const id = removeBtn.dataset.removeId;
  if (!id) return;
  const getData = localStorage.getItem('cart');
  if (!getData) return;
  const convert = JSON.parse(getData);
  const updateData = convert.filter((item: any) => {
    return item.id != id;
  });
  localStorage.setItem('cart', JSON.stringify(updateData));
  renderCart();
});


cartItems?.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;
  const increaseBtn = target.closest("[data-increase-id]") as HTMLElement | null;
  if (!increaseBtn) return;
  const id = increaseBtn.getAttribute("data-increase-id");
  if (!id) return;
  const getData = localStorage.getItem("cart");
  if (!getData) return;
  const convert = JSON.parse(getData);
  const findData = convert.find((item: any) => {
    return String(item.id) === String(id);
  });
  if (!findData) return;
  findData.quantity = findData.quantity + 1;
  localStorage.setItem("cart", JSON.stringify(convert));
  renderCart()
});


cartItems?.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;

  const decreaseBtn = target.closest("[data-decrease-id]");

  if (!decreaseBtn) return;

  let id = decreaseBtn.getAttribute('data-decrease-id')

  if (!id) return;
  const getData = localStorage.getItem("cart");
  if (!getData) return;
  const convert = JSON.parse(getData);
  const findData = convert.find((item: any) => {
    return String(item.id) === String(id);
  });
  if (!findData) return;
  findData.quantity = findData.quantity - 1;
  localStorage.setItem("cart", JSON.stringify(convert));
  renderCart()
});



const Product_body = document.getElementById(
  'Product_body'
) as HTMLElement | null


async function dasboadSection() {
  if (!Product_body) {
    console.error('Product_body element পাওয়া যায়নি!')
    return
  }

  try {
    const response = await api.get('/cartProducts')
    const data: Product[] = response.data

    console.log('API Response:', data)

    if (!Array.isArray(data)) {
      console.error('API response Array নয়:', data)
      return
    }

    Product_body.innerHTML = data.map((item:Product) => `<article id="${item.id}"
     class="flex flex-col gap-5 p-5 transition hover:bg-slate-50/70 md:flex-row md:items-center sm:p-6">

            <!-- Image -->
            <div class="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">

              <img
                src="${item.imageSelect}"
                alt="${item.imageAlt}"
                class="h-full w-full object-cover"
              />

            </div>


            <!-- Product Info -->
            <div class="min-w-0 flex-1">

              <div class="flex flex-wrap items-center gap-2">

                <h4 class="font-black">
                  ${item.productName}
                </h4>

                <span class="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-black text-green-600">
                  Published
                </span>

              </div>

              <p class="mt-1 line-clamp-1 text-sm text-slate-400">
                ${item.description}
              </p>


              <div class="mt-3 flex flex-wrap items-center gap-4 text-xs">

                <span class="font-bold text-[#d89500]">
                  ${item.category}
                </span>

                <span class="text-slate-400">
                  <i class="fa-solid fa-star mr-1 text-[#ffb31a]"></i>
                  ${item.ratingValue}
                </span>

                <span class="font-bold text-slate-700">
                  ৳${item.priceValue}
                </span>

                <span class="font-bold text-slate-500">
                  <i class="fa-solid fa-stopwatch mr-1"></i>
                  ${item.preparationTime} min
                </span>

              </div>

            </div>


            <!-- Actions -->
            <div class="flex items-center gap-2">

              <a
              data-edit-id="${item.id}"
                href="./edit.html?productId=${item.id}"
                class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-[#ffb31a] hover:text-[#d89500]"
              >
                <i class="fa-solid fa-pen"></i>
              </a>

              <button
              data-remove-id="${item.id}"
                type="button"
                class="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50"
              >
                <i class="fa-solid fa-trash"></i>
              </button>

            </div>

          </article>`).join('')
     

    console.log('Dashboard render successful!')
  } catch (error) {
    console.error('Dashboard render error:', error)
  }
}

dasboadSection()


let wishlistOpen = document.getElementById('wishlistOpen')
let wishlistOverlay = document.getElementById('wishlistOverlay')
let wishlistPopup = document.getElementById('wishlistPopup')
let closeWishlistBtn = document.getElementById('closeWishlistBtn')
let wishlistItems = document.getElementById('wishlistItems')
let wishSpen = document.getElementById('wishSpen')
let wishlistItemCount = document.getElementById('wishlistItemCount')

wishlistOpen?.addEventListener("click", (e) => {
  e.preventDefault()
  wishlistOverlay?.classList.remove("hidden")
  wishlistPopup?.classList.remove("translate-x-full")
  renderCart()
})
closeWishlistBtn?.addEventListener("click", (e) => {
  e.preventDefault()

  wishlistOverlay?.classList.add("hidden")
  wishlistPopup?.classList.add("translate-x-full")
})

menu_body?.addEventListener("click", async (e) => {
  const findbtn = e.target instanceof Element ? e.target.closest('[data-wish-id]') : null
  const id = findbtn?.getAttribute("data-wish-id")

  if (!id) return

  const getData = await api.get(`/cartProducts/${id}`)
  const data = getData.data
  const getWish = localStorage.getItem('wishlist')
  const wish = getWish ? JSON.parse(getWish) : []
  const existingProduct = wish.find(
    (item: Product) => String(item.id) === String(data.id)
  )
  if (existingProduct) {
    console.log('Product আগেই Wishlist-এ আছে!')
    return
  }
  wish.push(data)
  localStorage.setItem('wishlist', JSON.stringify(wish))
  console.log('Wishlist updated:', wish)
  await wishHelp()
})

async function wishHelp() {
  const getWish = localStorage.getItem('wishlist')
  const wish = getWish ? JSON.parse(getWish) : []
  if (wishSpen) wishSpen.textContent = String(wish.length)
  if (wishlistItemCount) wishlistItemCount.textContent = String(wish.length)
  const renderWish = wish.map((item: Product) => {
    return `<article
      data-wishlist-id="${item.id}"
      class="group relative flex gap-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-amber-200 hover:shadow-md"
    >
      <!-- Product Image -->
      <div
        class="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32"
      >
        <img
          src="${item.imageSelect}"
          alt="${item.imageAlt}"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <span
          class="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-[9px] font-extrabold uppercase text-white"
        >
          ${item.miniCategory}
        </span>
      </div>

      <!-- Product Details -->
      <div class="flex min-w-0 flex-1 flex-col">
        <div class="flex items-start justify-between gap-2">
          <div>
            <p
              class="text-[10px] font-bold uppercase tracking-wider text-amber-600"
            >
              ${item.category}
            </p>

            <h3 class="mt-1 text-sm font-extrabold text-gray-900 sm:text-base">
              ${item.productName}
            </h3>
          </div>

          <button
            type="button"
            data-remove-wishlist="${item.id}"
            aria-label="Remove Double Fire Burger"
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <i class="fa-solid fa-heart"></i>
          </button>
        </div>

        <div class="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
          <p class="text-lg font-black text-gray-900">
            ৳399
          </p>

          <button
            type="button"
            data-add-wishlist-cart="${item.id}"
            class="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 text-xs font-extrabold text-gray-950 transition hover:bg-amber-400"
          >
            <i class="fa-solid fa-cart-plus"></i>
            ${item.buttonText}
          </button>
        </div>
      </div>
    </article>`
  })
  if (wishlistItems) {
    wishlistItems.innerHTML = renderWish.join('')
  }
  console.log(renderWish);
}

wishHelp()

wishlistItems?.addEventListener('click', async (e) => {
  if (!(e.target instanceof Element)) return
  const findBtn = e.target.closest('[data-remove-wishlist]')
  if (!(findBtn instanceof HTMLElement)) return
  const id = findBtn.dataset.removeWishlist
  const getData = localStorage.getItem('wishlist')
  const convert = getData ? JSON.parse(getData) : []
  const filterData = convert.filter((item: any) => {
    return String(item.id) !== String(id)
  })
    localStorage.setItem(
    'wishlist',
    JSON.stringify(filterData)
  )
  wishHelp()
})


Product_body?.addEventListener("click",async(e)=>{
  if (!(e.target instanceof Element)) return
  let find = e.target.closest('[data-remove-id]')
  let findId = find instanceof HTMLElement ? find.dataset.removeId : undefined
  await api.delete(`/cartProducts/${findId}`)
dasboadSection()
  
})



const projectPopup = document.getElementById("projectPopup");
const popupBox = document.getElementById("popupBox");
const popupLoader = document.getElementById("popupLoader");
const closePopup = document.getElementById("closePopup");

let popupTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;

function openProjectPopup(): void {
  if (!projectPopup || !popupBox || !popupLoader) return;

  if (closeTimer) clearTimeout(closeTimer);
  if (popupTimer) clearTimeout(popupTimer);

  popupLoader.classList.remove("opacity-0", "pointer-events-none");

  projectPopup.classList.remove("invisible");
  projectPopup.setAttribute("aria-hidden", "false");

  document.body.classList.add("overflow-hidden");

  requestAnimationFrame(() => {
    projectPopup.classList.remove("opacity-0");
    projectPopup.classList.add("opacity-100");

    popupBox.classList.remove("scale-95");
    popupBox.classList.add("scale-100");
  });

  popupTimer = setTimeout(() => {
    popupLoader.classList.add("opacity-0", "pointer-events-none");
  }, 1600);
}

function closeProjectPopup(): void {
  if (!projectPopup || !popupBox || !popupLoader) return;

  if (popupTimer) clearTimeout(popupTimer);

  projectPopup.classList.remove("opacity-100");
  projectPopup.classList.add("opacity-0");

  popupBox.classList.remove("scale-100");
  popupBox.classList.add("scale-95");

  projectPopup.setAttribute("aria-hidden", "true");

  closeTimer = setTimeout(() => {
    projectPopup.classList.add("invisible");
    document.body.classList.remove("overflow-hidden");


    popupLoader.classList.remove(
      "opacity-0",
      "pointer-events-none"
    );
  }, 300);
}


window.addEventListener("load", () => {
  setTimeout(openProjectPopup, 250);
});


closePopup?.addEventListener("click", closeProjectPopup);


projectPopup?.addEventListener("click", (event: MouseEvent) => {
  if (event.target === projectPopup) {
    closeProjectPopup();
  }
});


document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeProjectPopup();
  }
});
