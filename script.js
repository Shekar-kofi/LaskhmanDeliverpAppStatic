function checkDistrict(val) {
    const otherInput = document.getElementById('other-district');
    otherInput.style.display = (val === 'other') ? 'block' : 'none';
    updateApplyNowButton();
}

function checkPlatform(val) {
    const otherInput = document.getElementById('other-platform');
    otherInput.style.display = (val === 'other') ? 'block' : 'none';
    updateApplyNowButton();
}

// Helper function to show loading overlay
function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

// Helper function to hide loading overlay
function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

// Real-time validation functions
function validateName(inputId, errorId) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);
    
    if (!input || !errorDiv) {
        return;
    }
    
    const value = input.value.trim();
    const validNamePattern = /^[a-zA-Z\s.'-]+$/;
    
    if (value === "") {
        errorDiv.textContent = "";
        errorDiv.style.display = "none";
    } else if (value.length > 30) {
        errorDiv.textContent = "Name must be 30 characters or less";
        errorDiv.style.display = "block";
    } else if (!validNamePattern.test(value)) {
        errorDiv.textContent = "Invalid name. Please use letters only.";
        errorDiv.style.display = "block";
    } else {
        errorDiv.textContent = "";
        errorDiv.style.display = "none";
    }
}

function validatePhone(inputId, errorId) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);
    
    if (!input || !errorDiv) {
        return;
    }
    
    const value = input.value.trim();
    const digitsOnly = /^[0-9]*$/;
    
    if (value === "") {
        errorDiv.textContent = "";
        errorDiv.style.display = "none";
    } else if (!digitsOnly.test(value)) {
        errorDiv.textContent = "Invalid phone number. Only digits are allowed.";
        errorDiv.style.display = "block";
    } else if (value.length < 10) {
        errorDiv.textContent = "Invalid phone number. Enter 10 digits.";
        errorDiv.style.display = "block";
    } else {
        errorDiv.textContent = "";
        errorDiv.style.display = "none";
    }
}

function showOtherLocation(selectId, otherId) {
    const select = document.getElementById(selectId);
    const otherInput = document.getElementById(otherId);
    if (!select || !otherInput) return;

    otherInput.style.display = select.value === 'other' ? 'block' : 'none';
    if (select.value !== 'other') {
        otherInput.value = '';
    }
}

function getSelectedLocationValue(selectId, otherId) {
    const select = document.getElementById(selectId);
    const otherInput = document.getElementById(otherId);
    if (!select) return '';

    if (select.value === 'other') {
        return otherInput ? otherInput.value.trim() : '';
    }
    return select.value.trim();
}

function updateApplyNowButton() {
    const districtSelect = document.getElementById("district");
    const otherdistrict = document.getElementById('other-district');
    const otherPlatform = document.getElementById('other-platform');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const applyBtn = document.getElementById("apply-btn");

    if (!applyBtn) {
        return;
    }

    // DISTRICT: If no dropdown exists, validation passes for district
    const districtValue = districtSelect ? districtSelect.value : "default";
    const otherDistrictValue = otherdistrict ? otherdistrict.value : "";
    const isDistrictValid = !districtSelect || districtValue !== "" && !(districtValue === 'other' && otherDistrictValue.trim() === "");

    // PLATFORM: Change this part to find the selected radio button
    const selectedPlatformRadio = document.querySelector('input[name="platform"]:checked');
    const platformValue = selectedPlatformRadio ? selectedPlatformRadio.value : "";
    const otherPlatformValue = otherPlatform ? otherPlatform.value : "";
    const isPlatformValid = platformValue !== "" && !(platformValue === 'other' && otherPlatformValue.trim() === "");

    // NAME and PHONE with validation
    const nameValue = nameInput ? nameInput.value.trim() : "";
    const phoneValue = phoneInput ? phoneInput.value.trim() : "";
    const isNameValid = nameValue !== "" && nameValue.length <= 30 && /^[a-zA-Z\s.'-]+$/.test(nameValue);
    const isPhoneValid = phoneValue !== "" && /^[0-9]{10}$/.test(phoneValue);

    // VALIDATION: Check all conditions
    const isInvalid = !isDistrictValid || !isPlatformValid || !isNameValid || !isPhoneValid;

    if (isInvalid) {
        applyBtn.style.opacity = "0.5";
        applyBtn.style.pointerEvents = "none";
    } else {
        applyBtn.style.opacity = "1";
        applyBtn.style.pointerEvents = "auto";
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

// Function to handle Apply Now button click (submits to Google Sheets)
async function handleApplyNowClick(event) {
    event.preventDefault();
    showLoading();

    try {
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

        // Validate name and phone
        if (nameValue === "" || nameValue.length > 30) {
            alert('Please enter a valid name (maximum 30 characters)');
            hideLoading();
            return;
        }
        if (phoneValue === "" || !/^[0-9]{10}$/.test(phoneValue)) {
            alert('Please enter a valid 10-digit phone number');
            hideLoading();
            return;
        }

        // Get District Text - use page title if no district select element
        let dText;
        if (districtSelect) {
            dText = (districtValue === 'other') ? otherDistrictValue : districtSelect.options[districtSelect.selectedIndex].text;
        } else {
            // For pages like delivery-jobs-visakhapatnam.html, extract district from page title
            dText = "Visakhapatnam"; // Default, can be enhanced to parse from page title
        }

        // Validate platform selection
        if (platformValue === "") {
            alert('Please select a delivery platform');
            hideLoading();
            return;
        }

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

        // Submit to Google Sheets only (no WhatsApp redirect)
        await submitToGoogleSheets(formData);

        // Show success message
        alert('Your application has been submitted successfully!');

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
        updateApplyNowButton();
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    } finally {
        hideLoading();
    }
}


// Function to handle quick WhatsApp icon click (just sends "I'm interested" message)
function handleQuickWhatsAppClick(event) {
    event.preventDefault();
    const message = "Hi, I am interested in the job.";
    const whatsappURL = `https://wa.me/919000210321?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

// Function to handle Advance Payment form submission
async function handleAdvancePaymentSubmit(event) {
    event.preventDefault();
    showLoading();

    try {
        const nameInput = document.getElementById('ap-name');
        const phoneInput = document.getElementById('ap-phone');
        const hubNameInput = document.getElementById('ap-hub-name');
        const hubInchargeInput = document.getElementById('ap-hub-incharge');
        const locationInput = document.getElementById('ap-location');
        const otherLocationInput = document.getElementById('ap-other-location');
        const submitBtn = document.getElementById('ap-submit-btn');

        if (!nameInput || !phoneInput || !hubNameInput || !hubInchargeInput || !locationInput) {
            return;
        }

        // Get form values
        const nameValue = nameInput.value.trim();
        const phoneValue = phoneInput.value.trim();
        const hubNameValue = hubNameInput.value.trim();
        const hubInchargeValue = hubInchargeInput.value.trim();
        const locationValue = getSelectedLocationValue('ap-location', 'ap-other-location');

        // Validate name and phone
        if (nameValue === "" || nameValue.length > 30) {
            alert('Please enter a valid name (maximum 30 characters)');
            return;
        }
        if (phoneValue === "" || !/^[0-9]{10}$/.test(phoneValue)) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        // Validate all fields are filled
        if (!hubNameValue || !hubInchargeValue || !locationValue) {
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
        if (otherLocationInput) {
            otherLocationInput.value = '';
            otherLocationInput.style.display = 'none';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    } finally {
        hideLoading();
    }
}

// Function to handle Refer a Friend form submission
async function handleReferFriendSubmit(event) {
    event.preventDefault();
    showLoading();

    try {
        const nameInput = document.getElementById('rf-name');
        const phoneInput = document.getElementById('rf-phone');
        const hubNameInput = document.getElementById('rf-hub-name');
        const referralNameInput = document.getElementById('rf-referral-name');
        const locationInput = document.getElementById('rf-location');
        const otherLocationInput = document.getElementById('rf-other-location');

        if (!nameInput || !phoneInput || !hubNameInput || !referralNameInput || !locationInput) {
            return;
        }

        const nameValue = nameInput.value.trim();
        const phoneValue = phoneInput.value.trim();
        const hubNameValue = hubNameInput.value.trim();
        const referralNameValue = referralNameInput.value.trim();
        const locationValue = getSelectedLocationValue('rf-location', 'rf-other-location');

        // Validate name and phone
        if (nameValue === "" || nameValue.length > 30) {
            alert('Please enter a valid name (maximum 30 characters)');
            return;
        }
        if (phoneValue === "" || !/^[0-9]{10}$/.test(phoneValue)) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        if (!hubNameValue || !referralNameValue || !locationValue) {
            alert('Please fill all fields');
            return;
        }

        // Submit to Google Sheets
        const formData = {
            name: nameValue,
            phone: phoneValue,
            hubName: hubNameValue,
            referralName: referralNameValue,
            location: locationValue,
            type: 'Referral',
            formType: 'Referral',
            timestamp: new Date().toISOString()
        };

        await submitToGoogleSheets(formData);
        alert('Referral submitted successfully!');

        nameInput.value = '';
        phoneInput.value = '';
        hubNameInput.value = '';
        referralNameInput.value = '';
        locationInput.value = '';
        if (otherLocationInput) {
            otherLocationInput.value = '';
            otherLocationInput.style.display = 'none';
        }
        updateReferFriendButton();
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    } finally {
        hideLoading();
    }
}

// Function to handle Complaint form submission
async function handleComplaintSubmit(event) {
    event.preventDefault();
    showLoading();

    try {
        const nameInput = document.getElementById('cm-name');
        const phoneInput = document.getElementById('cm-phone');
        const hubNameInput = document.getElementById('cm-hub-name');
        const complaintInput = document.getElementById('cm-complaint');

        if (!nameInput || !phoneInput || !hubNameInput || !complaintInput) {
            return;
        }

        const nameValue = nameInput.value.trim();
        const phoneValue = phoneInput.value.trim();
        const hubNameValue = hubNameInput.value.trim();
        const complaintValue = complaintInput.value.trim();

        // Validate name and phone
        if (nameValue === "" || nameValue.length > 30) {
            alert('Please enter a valid name (maximum 30 characters)');
            return;
        }
        if (phoneValue === "" || !/^[0-9]{10}$/.test(phoneValue)) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        if (!hubNameValue || !complaintValue) {
            alert('Please fill all fields');
            return;
        }

        const formData = {
            name: nameValue,
            phone: phoneValue,
            hubName: hubNameValue,
            complaint: complaintValue,
            type: 'Complaint',
            formType: 'Complaint',
            timestamp: new Date().toISOString()
        };

        await submitToGoogleSheets(formData);
        alert('Complaint submitted successfully!');

        nameInput.value = '';
        phoneInput.value = '';
        hubNameInput.value = '';
        complaintInput.value = '';
        updateComplaintButton();
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    } finally {
        hideLoading();
    }
}

// Function to validate Complaint form and enable/disable button
function updateComplaintButton() {
    const nameInput = document.getElementById('cm-name');
    const phoneInput = document.getElementById('cm-phone');
    const hubNameInput = document.getElementById('cm-hub-name');
    const complaintInput = document.getElementById('cm-complaint');
    const submitBtn = document.getElementById('cm-submit-btn');

    if (!submitBtn) return;

    const isValid = (nameInput && nameInput.value.trim() !== '' && nameInput.value.trim().length <= 30) &&
                    (phoneInput && phoneInput.value.trim() !== '' && /^[0-9]{10}$/.test(phoneInput.value.trim())) &&
                    (hubNameInput && hubNameInput.value.trim() !== '') &&
                    (complaintInput && complaintInput.value.trim() !== '');

    if (isValid) {
        submitBtn.style.opacity = '1';
        submitBtn.style.pointerEvents = 'auto';
        submitBtn.disabled = false;
    } else {
        submitBtn.style.opacity = '0.5';
        submitBtn.style.pointerEvents = 'none';
        submitBtn.disabled = true;
    }
}

// Function to validate Refer a Friend form and enable/disable button
function updateReferFriendButton() {
    const nameInput = document.getElementById('rf-name');
    const phoneInput = document.getElementById('rf-phone');
    const hubNameInput = document.getElementById('rf-hub-name');
    const referralNameInput = document.getElementById('rf-referral-name');
    const locationInput = document.getElementById('rf-location');
    const submitBtn = document.getElementById('rf-submit-btn');

    if (!submitBtn) return;

    const isValidName = nameInput && nameInput.value.trim() !== '' && nameInput.value.trim().length <= 30 && /^[a-zA-Z\s.'-]+$/.test(nameInput.value.trim());
    const isValidPhone = phoneInput && phoneInput.value.trim() !== '' && /^[0-9]{10}$/.test(phoneInput.value.trim());
    const isValidLocation = getSelectedLocationValue('rf-location', 'rf-other-location') !== '';
    const isValid = isValidName && isValidPhone &&
                    (hubNameInput && hubNameInput.value.trim() !== '') &&
                    (referralNameInput && referralNameInput.value.trim() !== '') &&
                    isValidLocation;

    if (isValid) {
        submitBtn.style.opacity = '1';
        submitBtn.style.pointerEvents = 'auto';
        submitBtn.disabled = false;
    } else {
        submitBtn.style.opacity = '0.5';
        submitBtn.style.pointerEvents = 'none';
        submitBtn.disabled = true;
    }
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

    const isValidName = nameInput && nameInput.value.trim() !== '' && nameInput.value.trim().length <= 30 && /^[a-zA-Z\s.'-]+$/.test(nameInput.value.trim());
    const isValidPhone = phoneInput && phoneInput.value.trim() !== '' && /^[0-9]{10}$/.test(phoneInput.value.trim());
    const isValidLocation = getSelectedLocationValue('ap-location', 'ap-other-location') !== '';
    const isValid = isValidName && isValidPhone &&
                    (hubNameInput && hubNameInput.value.trim() !== '') &&
                    (hubInchargeInput && hubInchargeInput.value.trim() !== '') &&
                    isValidLocation;

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
    console.log('DOMContentLoaded event fired');
    
    // 1. Listen to District dropdown
    const districtSelect = document.getElementById("district");
    if (districtSelect) {
        districtSelect.addEventListener("change", updateApplyNowButton);
    }
    
    // 2. Listen to District "Other" text input
    const otherDistrictInput = document.getElementById('other-district');
    if (otherDistrictInput) {
        otherDistrictInput.addEventListener('input', updateApplyNowButton);
    }

    // 3. Listen to Platform "Other" text input
    const otherPlatformInput = document.getElementById('other-platform');
    if (otherPlatformInput) {
        otherPlatformInput.addEventListener('input', updateApplyNowButton);
    }

    // 4. NEW: Listen to ALL Radio Buttons for Platform
    const platformRadios = document.querySelectorAll('input[name="platform"]');
    platformRadios.forEach(radio => {
        radio.addEventListener("change", updateApplyNowButton);
    });

    // 5. Listen to Name input
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('input', updateApplyNowButton);
        nameInput.addEventListener('input', () => validateName('name', 'name-error'));
    }

    // 6. Listen to Phone input
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', updateApplyNowButton);
        phoneInput.addEventListener('input', () => validatePhone('phone', 'phone-error'));
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

    // 8. Apply Now button click handler
    const applyBtn = document.getElementById("apply-btn");
    if (applyBtn) {
        applyBtn.addEventListener('click', handleApplyNowClick);
    }

    // 9. WhatsApp icon button click handler (quick message)
    const whatsappIconBtn = document.getElementById("whatsapp-icon-btn");
    if (whatsappIconBtn) {
        whatsappIconBtn.addEventListener('click', handleQuickWhatsAppClick);
    }

    // 9. Advance Payment form listeners
    const apNameInput = document.getElementById('ap-name');
    const apPhoneInput = document.getElementById('ap-phone');
    const apHubNameInput = document.getElementById('ap-hub-name');
    const apHubInchargeInput = document.getElementById('ap-hub-incharge');
    const apLocationInput = document.getElementById('ap-location');
    const apSubmitBtn = document.getElementById('ap-submit-btn');

    if (apNameInput) {
        apNameInput.addEventListener('input', updateAdvancePaymentButton);
        apNameInput.addEventListener('input', () => validateName('ap-name', 'ap-name-error'));
    }
    if (apPhoneInput) {
        apPhoneInput.addEventListener('input', updateAdvancePaymentButton);
        apPhoneInput.addEventListener('input', () => validatePhone('ap-phone', 'ap-phone-error'));
    }
    if (apHubNameInput) apHubNameInput.addEventListener('input', updateAdvancePaymentButton);
    if (apHubInchargeInput) apHubInchargeInput.addEventListener('input', updateAdvancePaymentButton);
    if (apLocationInput) {
        apLocationInput.addEventListener('change', updateAdvancePaymentButton);
        apLocationInput.addEventListener('change', () => showOtherLocation('ap-location', 'ap-other-location'));
        apLocationInput.addEventListener('change', updateAdvancePaymentButton);
    }
    const apOtherLocationInput = document.getElementById('ap-other-location');
    if (apOtherLocationInput) {
        apOtherLocationInput.addEventListener('input', updateAdvancePaymentButton);
    }
    if (apSubmitBtn) apSubmitBtn.addEventListener('click', handleAdvancePaymentSubmit);

    const rfNameInput = document.getElementById('rf-name');
    const rfPhoneInput = document.getElementById('rf-phone');
    const rfHubNameInput = document.getElementById('rf-hub-name');
    const rfReferralNameInput = document.getElementById('rf-referral-name');
    const rfLocationInput = document.getElementById('rf-location');
    const rfSubmitBtn = document.getElementById('rf-submit-btn');
    const referFriendForm = document.getElementById('refer-friend-form');

    if (rfNameInput) {
        rfNameInput.addEventListener('input', updateReferFriendButton);
        rfNameInput.addEventListener('input', () => validateName('rf-name', 'rf-name-error'));
    }
    if (rfPhoneInput) {
        rfPhoneInput.addEventListener('input', updateReferFriendButton);
        rfPhoneInput.addEventListener('input', () => validatePhone('rf-phone', 'rf-phone-error'));
    }
    if (rfHubNameInput) rfHubNameInput.addEventListener('input', updateReferFriendButton);
    if (rfReferralNameInput) rfReferralNameInput.addEventListener('input', updateReferFriendButton);
    if (rfLocationInput) {
        rfLocationInput.addEventListener('change', updateReferFriendButton);
        rfLocationInput.addEventListener('change', () => showOtherLocation('rf-location', 'rf-other-location'));
        rfLocationInput.addEventListener('change', updateReferFriendButton);
    }
    const rfOtherLocationInput = document.getElementById('rf-other-location');
    if (rfOtherLocationInput) {
        rfOtherLocationInput.addEventListener('input', updateReferFriendButton);
    }
    if (rfSubmitBtn) rfSubmitBtn.addEventListener('click', handleReferFriendSubmit);
    if (referFriendForm) referFriendForm.addEventListener('submit', handleReferFriendSubmit);

    const cmNameInput = document.getElementById('cm-name');
    const cmPhoneInput = document.getElementById('cm-phone');
    const cmHubNameInput = document.getElementById('cm-hub-name');
    const cmComplaintInput = document.getElementById('cm-complaint');
    const cmSubmitBtn = document.getElementById('cm-submit-btn');
    const complaintForm = document.getElementById('complaint-form');

    if (cmNameInput) {
        cmNameInput.addEventListener('input', updateComplaintButton);
        cmNameInput.addEventListener('input', () => validateName('cm-name', 'cm-name-error'));
    }
    if (cmPhoneInput) {
        cmPhoneInput.addEventListener('input', updateComplaintButton);
        cmPhoneInput.addEventListener('input', () => validatePhone('cm-phone', 'cm-phone-error'));
    }
    if (cmHubNameInput) cmHubNameInput.addEventListener('input', updateComplaintButton);
    if (cmComplaintInput) cmComplaintInput.addEventListener('input', updateComplaintButton);
    if (cmSubmitBtn) cmSubmitBtn.addEventListener('click', handleComplaintSubmit);
    if (complaintForm) complaintForm.addEventListener('submit', handleComplaintSubmit);

    // Initial validation for advance payment form
    updateAdvancePaymentButton();
    updateReferFriendButton();
    updateComplaintButton();
    
    // Initial call to set button to disabled (0.5 opacity) on load
    updateApplyNowButton();
});