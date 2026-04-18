function checkDistrict(val) {
    const otherInput = document.getElementById('other-district');
    otherInput.style.display = (val === 'other') ? 'block' : 'none';
    updateWhatsAppLink();
}

function checkPlatform(val) {
    const otherInput = document.getElementById('other-platform');
    otherInput.style.display = (val === 'other') ? 'block' : 'none';
    updateWhatsAppLink();
}




function updateWhatsAppLink() {
    const districtSelect = document.getElementById("district");
    const otherdistrict = document.getElementById('other-district');
    const otherPlatform = document.getElementById('other-platform');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const whatsappBtn = document.getElementById("whatsapp-btn");

    if (!whatsappBtn) {
        return;
    }

    // DISTRICT: Still uses the dropdown logic
    const districtValue = districtSelect ? districtSelect.value : "";
    const otherDistrictValue = otherdistrict ? otherdistrict.value : "";

    // PLATFORM: Change this part to find the selected radio button
    const selectedPlatformRadio = document.querySelector('input[name="platform"]:checked');
    const platformValue = selectedPlatformRadio ? selectedPlatformRadio.value : "";
    const otherPlatformValue = otherPlatform ? otherPlatform.value : "";

    // NAME and PHONE
    const nameValue = nameInput ? nameInput.value.trim() : "";
    const phoneValue = phoneInput ? phoneInput.value.trim() : "";

    // VALIDATION: Remains the same logic, but uses the new platformValue
    const isInvalid = (districtValue === "" || 
                      (districtValue === 'other' && otherDistrictValue.trim() === "") || 
                      platformValue === "" ||
                      (platformValue === 'other' && otherPlatformValue.trim() === "") ||
                      nameValue === "" ||
                      phoneValue === ""
                      );

    if (isInvalid) {
        whatsappBtn.style.opacity = "0.5";
        whatsappBtn.style.pointerEvents = "none";
        whatsappBtn.removeAttribute("href");
    } else {
        whatsappBtn.style.opacity = "1";
        whatsappBtn.style.pointerEvents = "auto";
        
        // Get District Text
        const dText = (districtValue === 'other') ? otherDistrictValue : districtSelect.options[districtSelect.selectedIndex].text;
        
        // PLATFORM TEXT: Logic change here to get text from the radio label if not 'other'
        let pText = "";
        if (platformValue === "other") {
          pText = otherPlatformValue;
        } else if (selectedPlatformRadio) {
          // Look for the image alt text first, otherwise use the div text
          const img = selectedPlatformRadio.parentElement.querySelector("img");
          pText = img
            ? img.alt
            : selectedPlatformRadio.parentElement.innerText.trim();
        }

        const message = `Hi, I am ${nameValue} (${phoneValue}). I am interested in a delivery job in ${dText} for ${pText} platform.`;
        whatsappBtn.href = `https://wa.me/919000210321?text=${encodeURIComponent(message)}`;
    }
}

// Function to submit data to Google Sheets
async function submitToGoogleSheets(formData) {
    // IMPORTANT: Replace this URL with your deployed Google Apps Script web app URL
    // Follow the setup instructions in README.md
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxt3noTtXlxG2KW2vKJWIeV3eHygPwapo_qgHddlZ3XMWfp4sRtlSMuFUJBo0hD1D7K/exec';

    try {
        const response = await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', // Since Google Apps Script doesn't support CORS
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // Since we're using no-cors, we can't read the response
        // We'll assume success and proceed to WhatsApp
        console.log('Data submitted to Google Sheets');
        return true;

    } catch (error) {
        console.error('Error submitting to Google Sheets:', error);
        // Still proceed to WhatsApp even if Google Sheets submission fails
        return true;
    }
}

// Function to handle WhatsApp button click
async function handleWhatsAppClick(event) {
    event.preventDefault();

    const districtSelect = document.getElementById("district");
    const otherdistrict = document.getElementById('other-district');
    const otherPlatform = document.getElementById('other-platform');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');

    // Get form data
    const districtValue = districtSelect ? districtSelect.value : "";
    const otherDistrictValue = otherdistrict ? otherdistrict.value : "";
    const selectedPlatformRadio = document.querySelector('input[name="platform"]:checked');
    const platformValue = selectedPlatformRadio ? selectedPlatformRadio.value : "";
    const otherPlatformValue = otherPlatform ? otherPlatform.value : "";
    const nameValue = nameInput ? nameInput.value.trim() : "";
    const phoneValue = phoneInput ? phoneInput.value.trim() : "";

    // Get District Text
    const dText = (districtValue === 'other') ? otherDistrictValue : districtSelect.options[districtSelect.selectedIndex].text;

    // Get Platform Text
    let pText = "";
    if (platformValue === "other") {
      pText = otherPlatformValue;
    } else if (selectedPlatformRadio) {
      const img = selectedPlatformRadio.parentElement.querySelector("img");
      pText = img ? img.alt : selectedPlatformRadio.parentElement.innerText.trim();
    }

    const message = `Hi, I am ${nameValue} (${phoneValue}). I am interested in a delivery job in ${dText} for ${pText} platform.`;

    // Prepare data for Google Sheets
    const formData = {
        name: nameValue,
        phone: phoneValue,
        district: dText,
        platform: pText,
        timestamp: new Date().toISOString()
    };

    // Submit to Google Sheets first
    await submitToGoogleSheets(formData);

    // Then open WhatsApp
    const whatsappURL = `https://wa.me/919000210321?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');

    // Clear all form fields
    if (nameInput) nameInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (districtSelect) districtSelect.value = '';
    if (otherdistrict) otherdistrict.value = '';
    if (otherPlatform) otherPlatform.value = '';
    
    // Clear platform selection
    document.querySelectorAll('input[name="platform"]').forEach(radio => {
        radio.checked = false;
    });

    // Hide "Other" inputs
    if (otherdistrict) otherdistrict.style.display = 'none';
    if (otherPlatform) otherPlatform.style.display = 'none';

    // Reset button state
    updateWhatsAppLink();
}


// Function to handle Advance Payment form submission
async function handleAdvancePaymentSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById('ap-name');
    const phoneInput = document.getElementById('ap-phone');
    const hubNameInput = document.getElementById('ap-hub-name');
    const hubInchargeInput = document.getElementById('ap-hub-incharge');
    const locationInput = document.getElementById('ap-location');
    const submitBtn = document.getElementById('ap-submit-btn');

    if (!nameInput || !phoneInput || !hubNameInput || !hubInchargeInput || !locationInput) {
        return;
    }

    // Get form values
    const nameValue = nameInput.value.trim();
    const phoneValue = phoneInput.value.trim();
    const hubNameValue = hubNameInput.value.trim();
    const hubInchargeValue = hubInchargeInput.value.trim();
    const locationValue = locationInput.value.trim();

    // Validate all fields are filled
    if (!nameValue || !phoneValue || !hubNameValue || !hubInchargeValue || !locationValue) {
        alert('Please fill all fields');
        return;
    }

    // Prepare data for Google Sheets
    const formData = {
        name: nameValue,
        phone: phoneValue,
        hubName: hubNameValue,
        hubIncharge: hubInchargeValue,
        location: locationValue,
        type: 'AdvancePayment',
        formType: 'AdvancePayment',
        timestamp: new Date().toISOString()
    };

    // Submit to Google Sheets
    await submitToGoogleSheets(formData);

    // Show success message
    alert('Your advance payment request has been submitted successfully!');

    // Clear form fields
    nameInput.value = '';
    phoneInput.value = '';
    hubNameInput.value = '';
    hubInchargeInput.value = '';
    locationInput.value = '';
}

// Function to validate Advance Payment form and enable/disable button
function updateAdvancePaymentButton() {
    const nameInput = document.getElementById('ap-name');
    const phoneInput = document.getElementById('ap-phone');
    const hubNameInput = document.getElementById('ap-hub-name');
    const hubInchargeInput = document.getElementById('ap-hub-incharge');
    const locationInput = document.getElementById('ap-location');
    const submitBtn = document.getElementById('ap-submit-btn');

    if (!submitBtn) return;

    const isValid = (nameInput && nameInput.value.trim() !== '') &&
                    (phoneInput && phoneInput.value.trim() !== '') &&
                    (hubNameInput && hubNameInput.value.trim() !== '') &&
                    (hubInchargeInput && hubInchargeInput.value.trim() !== '') &&
                    (locationInput && locationInput.value.trim() !== '');

    if (isValid) {
        submitBtn.style.opacity = "1";
        submitBtn.style.pointerEvents = "auto";
    } else {
        submitBtn.style.opacity = "0.5";
        submitBtn.style.pointerEvents = "none";
    }
}


// Ensure elements exist before adding listeners
window.addEventListener('DOMContentLoaded', () => {
    // 1. Listen to District dropdown
    const districtSelect = document.getElementById("district");
    if (districtSelect) {
        districtSelect.addEventListener("change", updateWhatsAppLink);
    }
    
    // 2. Listen to District "Other" text input
    const otherDistrictInput = document.getElementById('other-district');
    if (otherDistrictInput) {
        otherDistrictInput.addEventListener('input', updateWhatsAppLink);
    }

    // 3. Listen to Platform "Other" text input
    const otherPlatformInput = document.getElementById('other-platform');
    if (otherPlatformInput) {
        otherPlatformInput.addEventListener('input', updateWhatsAppLink);
    }

    // 4. NEW: Listen to ALL Radio Buttons for Platform
    const platformRadios = document.querySelectorAll('input[name="platform"]');
    platformRadios.forEach(radio => {
        radio.addEventListener("change", updateWhatsAppLink);
    });

    // 5. Listen to Name input
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('input', updateWhatsAppLink);
    }

    // 6. Listen to Phone input
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', updateWhatsAppLink);
    }

    // 7. Menu toggle behavior
    const menuToggle = document.getElementById('menu-toggle');
    const menuDropdown = document.getElementById('menu-dropdown');
    if (menuToggle && menuDropdown) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuDropdown.classList.toggle('show');
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            menuDropdown.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        });

        document.addEventListener('click', (event) => {
            if (!menuToggle.contains(event.target) && !menuDropdown.contains(event.target)) {
                menuDropdown.classList.remove('show');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuDropdown.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // 8. WhatsApp button click handler
    const whatsappBtn = document.getElementById("whatsapp-btn");
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', handleWhatsAppClick);
    }

    // 9. Advance Payment form listeners
    const apNameInput = document.getElementById('ap-name');
    const apPhoneInput = document.getElementById('ap-phone');
    const apHubNameInput = document.getElementById('ap-hub-name');
    const apHubInchargeInput = document.getElementById('ap-hub-incharge');
    const apLocationInput = document.getElementById('ap-location');
    const apSubmitBtn = document.getElementById('ap-submit-btn');

    if (apNameInput) apNameInput.addEventListener('input', updateAdvancePaymentButton);
    if (apPhoneInput) apPhoneInput.addEventListener('input', updateAdvancePaymentButton);
    if (apHubNameInput) apHubNameInput.addEventListener('input', updateAdvancePaymentButton);
    if (apHubInchargeInput) apHubInchargeInput.addEventListener('input', updateAdvancePaymentButton);
    if (apLocationInput) apLocationInput.addEventListener('input', updateAdvancePaymentButton);
    if (apSubmitBtn) apSubmitBtn.addEventListener('click', handleAdvancePaymentSubmit);

    // Initial validation for advance payment form
    updateAdvancePaymentButton();
    
    // Initial call to set button to disabled (0.5 opacity) on load
    updateWhatsAppLink();
});