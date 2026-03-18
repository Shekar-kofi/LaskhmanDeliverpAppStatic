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
    const whatsappBtn = document.getElementById("whatsapp-btn");

    // DISTRICT: Still uses the dropdown logic
    const districtValue = districtSelect.value;
    const otherDistrictValue = otherdistrict.value;

    // PLATFORM: Change this part to find the selected radio button
    const selectedPlatformRadio = document.querySelector('input[name="platform"]:checked');
    const platformValue = selectedPlatformRadio ? selectedPlatformRadio.value : "";
    const otherPlatformValue = otherPlatform.value;

    // VALIDATION: Remains the same logic, but uses the new platformValue
    const isInvalid = (districtValue === "" || 
                      (districtValue === 'other' && otherDistrictValue.trim() === "") || 
                      platformValue === "" ||
                      (platformValue === 'other' && otherPlatformValue.trim() === "")
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

        const message = `Hi, I am interested in a delivery job in ${dText} for ${pText} platform.`;
        whatsappBtn.href = `https://wa.me/919000210321?text=${encodeURIComponent(message)}`;
    }
}


// Ensure elements exist before adding listeners
window.addEventListener('DOMContentLoaded', () => {
    // 1. Listen to District dropdown
    document.getElementById("district").addEventListener("change", updateWhatsAppLink);
    
    // 2. Listen to District "Other" text input
    document.getElementById('other-district').addEventListener('input', updateWhatsAppLink);

    // 3. Listen to Platform "Other" text input
    document.getElementById('other-platform').addEventListener('input', updateWhatsAppLink);

    // 4. NEW: Listen to ALL Radio Buttons for Platform
    const platformRadios = document.querySelectorAll('input[name="platform"]');
    platformRadios.forEach(radio => {
        radio.addEventListener("change", updateWhatsAppLink);
    });
    
    // Initial call to set button to disabled (0.5 opacity) on load
    updateWhatsAppLink();
});