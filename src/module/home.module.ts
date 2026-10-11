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
  preparationTime:string|number
}

// ===============================
// DOM ELEMENTS
// ===============================

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

    const buttonColor = getValue('buttonColor')
    const buttonSize = getValue('buttonSize')
    previewCardButton.classList.remove(
      'bg-[#f5a900]',
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

    previewCardButton.classList.add(
      buttonColor || 'bg-[#f5a900]',
      buttonSize || 'px-4',
      'text-[#181818]'
    )
  }

  // Update badge background
  if (previewCardBadge) {
    const badgeStyle = getValue('badgeStyle')

    previewCardBadge.classList.remove(
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-emerald-500',
      'bg-black'
    )

    previewCardBadge.classList.add(
      badgeStyle || 'bg-red-500'
    )
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

              <span
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

async function updateCartBadge() {
  const totalQuantity = await api
    .get('/carts')
    .then((res) =>
      Array.isArray(res.data)
        ? res.data.reduce((total: number, item: any) => {
          const quantity = Number(item?.quantity ?? 0)
          return total + (Number.isFinite(quantity) ? quantity : 0)
        }, 0)
        : 0
    )
    .catch(() => 0)

  if (cartSpen) {
    cartSpen.textContent = String(totalQuantity)
  }

  localStorage.setItem('cartCount', String(totalQuantity))
}

menu_body?.addEventListener('click', async (e) => {
  e.preventDefault()

  if (!(e.target instanceof Element)) return

  const findBtn = e.target.closest<HTMLElement>('[data-add-id]')
  if (!findBtn) return

  const productId = findBtn.dataset.addId
  if (!productId) return

  try {
    const productsRes = await api.get('/cartProducts')
    const selectedProduct = productsRes.data.find((item: any) => {
      return String(item.id) === String(productId)
    })

    if (!selectedProduct) return

    const cartRes = await api.get('/carts')
    const currentCart = Array.isArray(cartRes.data) ? cartRes.data : []
    const existingCartItem = currentCart.find((item: any) => {
      return (
        String(item?.existing?.id ?? item?.productId ?? item?.id) ===
        String(productId)
      )
    })

    if (existingCartItem?.id) {
      const nextQuantity = Number(existingCartItem.quantity ?? 0) + 1
      await api.put(`/carts/${existingCartItem.id}`, {
        ...existingCartItem,
        quantity: nextQuantity,
      })
    } else {
      await api.post('/carts', {
        existing: selectedProduct,
        quantity: 1,
      })
    }

    localStorage.setItem('cart', JSON.stringify({ ...selectedProduct, quantity: 1 }))
    await updateCartBadge()
  } catch (error) {
    console.error('Cart update error:', error)
  }
})

updateCartBadge()


let cartOpen = document.getElementById("cartOpen") as HTMLAnchorElement
let cartOverlay = document.getElementById('cartOverlay')
let cartPopup = document.getElementById('cartPopup')
let closeCartBtn = document.getElementById('closeCartBtn')
let cartItems = document.getElementById('cartItems')
let cartTotal = document.getElementById('cartTotal')
let cartItemCount = document.getElementById('cartItemCount')

cartOpen?.addEventListener("click", (e) => {
  e.preventDefault()
  cartOverlay?.classList.remove("hidden")
  cartPopup?.classList.remove("translate-x-full")
  cartRander()
})
closeCartBtn?.addEventListener("click", (e) => {
  e.preventDefault()

  cartOverlay?.classList.add("hidden")
  cartPopup?.classList.add("translate-x-full")
})

async function cartRander() {
  let cartPageRander = ""
  let res = await api.get('/carts')
  let data = res.data
  const subtotal = data.reduce((total: number, item: any) => {
    return total + item.existing.priceValue * item.quantity;
  }, 0);
  if (cartTotal) cartTotal.textContent = `৳ ${String(subtotal)}`
  if (cartItemCount) { cartItemCount.textContent = String(res.data.length) }
   data.map((item: any) => {
    cartPageRander += `  <article
    data-cart-id="${item.id}"
    class="group relative flex gap-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition hover:border-amber-200 hover:shadow-md"
  >
    <!-- Product Image -->
    <div
      class="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32"
    >
      <img
        data-product-image
        src="${item.existing.imageSelect}"
        alt="Double Cheeseburger"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <span
        class="absolute left-2 top-2 rounded-md bg-amber-500 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-gray-950"
      >
      ${item.existing.badgeText}
      </span>
    </div>

    <!-- Product Information -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Name and Remove Button -->
      <div class="flex items-start justify-between gap-2">
        <h3
          data-product-name
          class="line-clamp-2 text-sm font-extrabold leading-5 text-gray-900 sm:text-base"
        >
          ${item.existing.productName}
        </h3>

        <button
          type="button"
          data-remove-id="${item.id}"
          aria-label="Remove product"
          class="shrink-0 rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 7h12m-10 0l.7 13h6.6L16 7M9 7V4h6v3m-5 4v5m4-5v5"
            />
          </svg>
        </button>
      </div>

      <!-- Price Per Unit -->
      <p class="mt-1 text-xs text-gray-500">
        প্রতি পিস
        <span data-unit-price class="font-semibold text-gray-700">
          ৳${item.existing.priceValue}
        </span>
      </p>

      <!-- Quantity and Total Price -->
      <div class="mt-auto flex items-end justify-between gap-2 pt-3">
        <!-- Quantity Controls -->
        <div
          class="flex h-9 items-center rounded-xl border border-gray-200 bg-gray-50 p-1"
        >
          <button
            type="button"
            data-decrease-id="${item.id}"
            aria-label="Decrease quantity"
            class="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white hover:text-amber-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
            </svg>
          </button>

          <span
            data-quantity
            class="min-w-8 px-1 text-center text-sm font-extrabold text-gray-900"
          >
            ${item.quantity}
          </span>

          <button
            type="button"
            data-increase-id="${item.id}"
            aria-label="Increase quantity"
            class="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-gray-950 transition hover:bg-amber-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 5v14m-7-7h14"
              />
            </svg>
          </button>
        </div>

        <!-- Product Total -->
        <div class="text-right">
          <p class="text-[10px] font-medium text-gray-400">মোট দাম</p>
          <p
            data-line-total
            class="mt-0.5 whitespace-nowrap text-base font-black text-gray-900"
          >
            ৳${item.existing.priceValue * item.quantity}
          </p>
        </div>
      </div>
    </div>
  </article>`
  })


  if (cartItems) {
    cartItems.innerHTML = cartPageRander
  }
  let tokenOrderItems = document.getElementById('tokenOrderItems')
  if (tokenOrderItems) tokenOrderItems.innerHTML = cartPageRander
}

cartItems?.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;

  const removeBtn = target.closest("[data-remove-id]");

  if (!removeBtn) return;

  const id = removeBtn.getAttribute("data-remove-id");

  if (!id) return;

  await api.delete(`/carts/${id}`);

  await cartRander();
});

cartItems?.addEventListener("click", async (e) => {
  e.preventDefault()
  const target = e.target as HTMLElement;

  const increaseBtn = target.closest("[data-increase-id]");

  if (!increaseBtn) return;

  let id = increaseBtn.getAttribute('data-increase-id')

  let res = await api.get(`/carts/${id}`)
  let data = res.data.quantity
  let update = data + 1
  await api.patch(`/carts/${id}`, { quantity: update })
  await cartRander()
});

cartItems?.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;

  const decreaseBtn = target.closest("[data-decrease-id]");

  if (!decreaseBtn) return;

  let id = decreaseBtn.getAttribute('data-decrease-id')

  let res = await api.get(`/carts/${id}`)
  let data = res.data.quantity
  let update = data - 1
  await api.patch(`/carts/${id}`, { quantity: update })
  await cartRander()
});