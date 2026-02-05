// --- ANIMATIONS & OBSERVERS ---
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.glass-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, { threshold: 0.1 });
    cards.forEach((card, index) => {
        card.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
        card.style.transitionDelay = `${index * 50}ms`;
        observer.observe(card);
    });
});

// --- SERVICE MODAL LOGIC ---
const serviceData = {
    android: {
        icon: '<i class="fa-brands fa-android text-accent-secondary"></i>',
        bgClass: 'bg-accent-secondary/20',
        textClass: 'text-accent-secondary',
        contentKey: 'service2_modal_content'
    }
};

const modalService = document.getElementById('serviceModal');

function openServiceDetails(serviceType) {
    const data = serviceData[serviceType];
    if(!data) return;

    // Setup UI
    const iconContainer = document.getElementById('modalIconContainer');
    iconContainer.innerHTML = data.icon;
    iconContainer.className = `w-12 h-12 rounded-full flex items-center justify-center text-2xl ${data.bgClass}`;
    
    // Get Keys
    const titleKey = serviceType === 'android' ? 'service2_title' : 'service_title';
    const subtitleKey = serviceType === 'android' ? 'service2_subtitle' : 'service_subtitle';
    
    // Populate Text
    document.getElementById('modalTitle').textContent = translations[currentLang][titleKey] || "Service";
    document.getElementById('modalSubtitle').textContent = translations[currentLang][subtitleKey] || "";
    
    // Render Markdown
    const description = translations[currentLang][data.contentKey];
    document.getElementById('modalContent').innerHTML = marked.parse(description);

    modalService.classList.remove('hidden');
}

function closeServiceModal() {
    modalService.classList.add('hidden');
}

// --- LANGUAGE LOGIC ---
let currentLang = 'en'; // Variable inicial

function toggleLanguage() {
    // Si es ES cambia a EN, si es EN cambia a ES
    currentLang = currentLang === 'es' ? 'en' : 'es';
    
    document.getElementById('langDisplay').innerText = currentLang.toUpperCase();
    
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[currentLang][key]) {
            if(key.includes('desc') || key === 'about_desc') {
                el.innerHTML = translations[currentLang][key]; 
            } else {
                el.innerText = translations[currentLang][key];
            }
        }
    });

    document.getElementById('inputName').placeholder = translations[currentLang].placeholder_name;
    document.getElementById('contactMessage').placeholder = translations[currentLang].placeholder_msg;
    document.getElementById('appIdeaInput').placeholder = translations[currentLang].placeholder_idea;
}

// --- AI FEATURE 1: APP CONCEPT ---
const modal = document.getElementById('aiModal');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');
const resultArea = document.getElementById('aiResult');
const ideaInput = document.getElementById('appIdeaInput');

function openModal() { modal.classList.remove('hidden'); }
function closeModal() { modal.classList.add('hidden'); }

async function generateAppConcept() {
    const idea = ideaInput.value.trim();
    if (!idea) { alert("Please describe your idea."); return; }
    
    generateBtn.disabled = true;
    btnText.textContent = currentLang === 'en' ? "Architecting..." : "Procesando...";
    btnLoader.classList.remove('hidden');
    resultArea.classList.add('hidden');
    resultArea.innerHTML = '';

    const langPrompt = currentLang === 'en' ? "Respond in English" : "Responde en Español";
    const systemPrompt = `You are Kevin, a Senior Android Developer. The user has an app idea: "${idea}". Generate a concise technical proposal. ${langPrompt}. Structure: 1. App Name, 2. Core Features, 3. Tech Stack (Java/Kotlin, Firebase), 4. Developer Note. Use Markdown.`;

    const response = await callGemini(systemPrompt);

    generateBtn.disabled = false;
    btnText.textContent = translations[currentLang].ai_modal_btn;
    btnLoader.classList.add('hidden');

    if (response) {
        resultArea.innerHTML = marked.parse(response);
        resultArea.classList.remove('hidden');
    } else {
        alert("Error generating proposal.");
    }
}

// --- AI FEATURE 2: REFINE MESSAGE ---
async function refineMessage() {
    const textarea = document.getElementById('contactMessage');
    const refineBtnText = document.getElementById('refineBtnText');
    const refineLoader = document.getElementById('refineLoader');
    const originalText = textarea.value.trim();

    if (!originalText) { alert("Type a message first."); return; }

    refineBtnText.classList.add('hidden');
    refineLoader.classList.remove('hidden');

    const langPrompt = currentLang === 'en' ? "in English" : "en Español";
    const prompt = `Rewrite the following message to make it more professional ${langPrompt}. Original: "${originalText}". Return ONLY the rewritten text.`;

    const refinedText = await callGemini(prompt);

    refineBtnText.classList.remove('hidden');
    refineLoader.classList.add('hidden');

    if (refinedText) textarea.value = refinedText.trim();
    else alert("Error refining text.");
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    currentLang = 'es';
    toggleLanguage(); 
});