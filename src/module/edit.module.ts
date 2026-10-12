import api from "../../lib/api";

let productForm = document.getElementById('productForm') as HTMLFormElement 

async function loadProductData() {
  const params = new URLSearchParams(window.location.search)
  const Id = params.get("productId")

  if (!Id) return

  try {
    const response = await api.get(`/cartProducts/${Id}`)
    const data = response.data

    Object.entries(data).forEach(([key, value]) => {
      const field = productForm.elements.namedItem(key)

      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) {
        if (field.type === "radio") {
          const radio = productForm.querySelector(
            `input[name="${key}"][value="${value}"]`
          ) as HTMLInputElement | null

          if (radio) radio.checked = true
        } else {
          field.value = String(value ?? "")
        }
      }
    })

    console.log("আগের Product Data:", data)
  } catch (error) {
    console.error("Product load করতে সমস্যা হয়েছে:", error)
  }
}

loadProductData()


productForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const params = new URLSearchParams(window.location.search)
  const Id = params.get("productId")

  const formData = new FormData(productForm)
  const entries = Object.fromEntries(formData.entries())

  try {
    if (Id) {
      const response = await api.patch(
        `/cartProducts/${Id}`,
        entries
      )

      console.log("Product Updated:", response.data)
      alert("Product সফলভাবে আপডেট হয়েছে!")
    } else {
      const response = await api.post(
        "/cartProducts",
        entries
      )

      console.log("Product Created:", response.data)
      alert("নতুন Product সফলভাবে যোগ হয়েছে!")
    }
  } catch (error) {
    console.error("Save করতে সমস্যা হয়েছে:", error)
    alert("Product Save করা যায়নি!")
  }
})


const previewCardImage = document.getElementById(
  'prev-img'
) as HTMLImageElement | null

const previewCardBadge = document.getElementById(
  'prev-badge'
) as HTMLDivElement | null

const previewCardRating = document.getElementById(
  'prev-rating'
) as HTMLDivElement | null

const previewCardBadgeWrapper =
  document.getElementById('prev-badge-wrapper') as HTMLDivElement | null

const previewCardPreparation = document.getElementById('prev-time') as HTMLElement | null

const previewCardTitle = document.getElementById(
  'prev-name'
) as HTMLElement | null

const previewCardDesc = document.getElementById(
  'prev-desc'
) as HTMLElement | null

const previewCardPrice = document.getElementById(
  'prev-price'
) as HTMLElement | null

const previewBtnText = document.getElementById(
  'previewBtnText'
) as HTMLElement | null

// Additional preview elements
const previewCardCategory = document.getElementById(
  'prev-category'
) as HTMLElement | null

const previewCardMiniCategory = document.getElementById(
  'previewCardMiniCategory'
) as HTMLElement | null

const previewCardHeat = document.getElementById(
  'previewCardHeat'
) as HTMLElement | null

const previewCardButton = document.getElementById(
  'previewAddToCartBtn'
) as HTMLButtonElement | null

// ===============================
// LIVE PREVIEW
// ===============================

function updatePreview() {
  if (!productForm) return

  const formData = new FormData(productForm)

  const getValue = (name: string): string => {
    return String(formData.get(name) ?? '').trim()
  }

  const imageSelect = getValue('imageSelect')
  const badgeText = getValue('badgeText')
  const ratingValue = getValue('ratingValue')
  const heroLevel = getValue('heroLevel')
  const productName = getValue('productName')
  const description = getValue('description')
  const priceValue = getValue('priceValue')
  const buttonText = getValue('buttonText')
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



  if (previewCardTitle) {
    previewCardTitle.textContent = productName || 'Product Name'
  }

  if (previewCardDesc) {
    previewCardDesc.textContent =
      description || 'Your product description will appear here.'
  }

  if (previewCardPrice) {
    previewCardPrice.textContent = priceValue || '0'
  }

  if (previewBtnText) {
    previewBtnText.textContent = buttonText || 'Add to Cart'
  }

  if (previewCardCategory) {
    previewCardCategory.textContent = category || 'Category'
  }


    if (previewCardPreparation) {
  previewCardPreparation.textContent = preparetionTime || '3'
}
  

  if (previewCardMiniCategory) {
    previewCardMiniCategory.textContent =
      miniCategory || 'Featured'
  }

  if (previewCardHeat) {
    previewCardHeat.textContent = heroLevel || 'Normal'
  }

 
if (previewCardButton) {
  const colorMap: Record<string, string> = {
    'Amber Gold': 'bg-[#f5a900]',
    'Dark Charcoal': 'bg-[#333333]',
    Black: 'bg-black',
    Red: 'bg-red-500',
    Emerald: 'bg-emerald-500',
  }

  const sizeMap: Record<string, string> = {
    Small: 'px-3 text-xs',
    Medium: 'px-4 text-sm',
    Large: 'px-6 text-base',
  }

  const buttonColor =
    colorMap[getValue('buttonColor')] || 'bg-[#f5a900]'

  const buttonSize =
    sizeMap[getValue('buttonSize')] || 'px-4 text-sm'

  previewCardButton.classList.remove(
    'bg-[#f5a900]',
    'bg-[#333333]',
    'bg-black',
    'bg-red-500',
    'bg-emerald-500',
    'px-3',
    'px-4',
    'px-6',
    'text-xs',
    'text-sm',
    'text-base'
  )

  previewCardButton.classList.add(buttonColor)

  buttonSize.split(' ').forEach((className) => {
    previewCardButton.classList.add(className)
  })
}

if (previewCardBadgeWrapper) {
  const badgeStyle = getValue('badgeStyle')

  const styleMap: Record<string, string> = {
    'Red / Danger': 'bg-red-500',
    Orange: 'bg-orange-500',
    'Amber Gold': 'bg-amber-500',
    Emerald: 'bg-emerald-500',
    Black: 'bg-black',
  }

  const badgeClass = styleMap[badgeStyle] || 'bg-amber-500'

  previewCardBadgeWrapper.classList.remove(
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-black'
  )

  previewCardBadgeWrapper.classList.add(badgeClass)
}

}


productForm?.addEventListener('input', updatePreview)
productForm?.addEventListener('change', updatePreview)