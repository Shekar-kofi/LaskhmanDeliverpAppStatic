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
    const platformSelect = document.getElementById("platform");
    const otherdistrict = document.getElementById('other-district');
    const otherPlatform = document.getElementById('other-platform');
    const whatsappBtn = document.getElementById("whatsapp-btn");

    const districtValue = districtSelect.value;
    const platformValue = platformSelect.value;
    const otherDistrictValue = otherdistrict.value;
    const otherPlatformValue = otherPlatform.value;

    // VALIDATION: Check if empty
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
        
        // Use custom text if 'other' is selected
        const dText = (districtValue === 'other') ? otherDistrictValue : districtSelect.options[districtSelect.selectedIndex].text;
        const pText =  (platformValue === 'other') ? otherPlatformValue : platformSelect.options[platformSelect.selectedIndex].text;

        const message = `Hi, I am interested in a delivery job in ${dText} for ${pText} platform.`;
        whatsappBtn.href = `https://wa.me/919000210321?text=${encodeURIComponent(message)}`;
    }
}

// Ensure elements exist before adding listeners
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("district").addEventListener("change", updateWhatsAppLink);
    document.getElementById("platform").addEventListener("change", updateWhatsAppLink);
    document.getElementById('other-district').addEventListener('input', updateWhatsAppLink);
    
    // Initial call
    updateWhatsAppLink();
});