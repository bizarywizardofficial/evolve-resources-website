// --- 1. FIREBASE INITIALIZATION (Using CDN Modules for Vanilla JS) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getStorage,
  ref,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app-check.js";

const firebaseConfig = {
  apiKey: "AIzaSyCkGIv1QmICoEjsOS4oZ_HfgRlQnCDcYrQ", // Ensure this is your real API key
  authDomain: "evolv28-resource-hub.firebaseapp.com",
  projectId: "evolv28-resource-hub",
  storageBucket: "evolv28-resource-hub.firebasestorage.app",
  messagingSenderId: "501350615061",
  appId: "1:501350615061:web:1f78f9c015d29d83fda61c",
  measurementId: "G-0RVTKN30YW",
};

// Initialize App
const app = initializeApp(firebaseConfig);

// Initialize App Check (IMPORTANT: You will need to generate a reCAPTCHA v3 Enterprise key in Google Cloud)
// If you do not have the key yet, you can comment out these lines while testing.
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    "6Lf1FTEtAAAAAM6se11cgpz_Na9vphFkOaYuKGqp"
  ),
  isTokenAutoRefreshEnabled: true,
});

// Initialize Storage
const storage = getStorage(app);

// --- 2. RESOURCE DATA (Updated to use Firebase Storage Paths) ---
const resources = [
  {
    id: "brochures",
    title: "Brochures",
    icon: "book-open",
    color: "var(--sky-blue)",
    description:
      "Product overviews, key features, intended use, technology framework, and other offerings.",
    documents: [
      {
        title: "Clinical Trials Brochure",
        storagePath: "Brochures/Clinical Trials Brochure.pdf",
      },
      {
        title: "Evolv28 Comparision and Advantages",
        storagePath: "Brochures/Evolv28 Comparision and Advantages.pdf",
      },
      {
        title: "Evolv28 Corporate Brochure v2",
        storagePath: "Brochures/Evolv28 Corporate Brochure v2.pdf",
      },
      {
        title: "Evolv28 Sleep Brochure",
        storagePath: "Brochures/Evolv28 Sleep Brochure.pdf",
      },
    ],
  },
  {
    id: "certifications",
    title: "Certifications",
    icon: "ticket-check",
    color: "var(--coral)",
    description:
      "Regulatory certifications, testing reports, compliance documentation, and product safety standards.",
    documents: [
      {
        title: "CE Certification (Europe)",
        storagePath: "Certifications/CE Certification (Europe) for Evolv28.pdf",
      },
      {
        title: "FCC 15C (USA)",
        storagePath:
          "Certifications/FCC Certification_15C (USA) for Evolv28.pdf",
      },
      {
        title: "FCC 15B (USA)",
        storagePath:
          "Certifications/FCC Certifications_15B (USA) for Evolv28.pdf",
      },
      {
        title: "FDA EMC Test Report",
        storagePath: "Certifications/FDA_ EMC Test Report.pdf",
      },
      {
        title: "FDA Electrical Safety",
        storagePath:
          "Certifications/FDA_Electrical_Safety_Test Report_Final .pdf",
      },
      {
        title: "ISED (Canada)",
        storagePath:
          "Certifications/ISED Certification (Canada) for Evolv28.pdf",
      },
      {
        title: "WPC (India)",
        storagePath: "Certifications/WPC Certification (India) for Evolv28.pdf",
      },
    ],
  },
  {
    id: "clinical-trials",
    title: "Clinical Evidence",
    icon: "microscope",
    color: "var(--harmony-green)",
    description:
      "Clinical studies, research findings, physiological outcomes, and evidence supporting product effectiveness.",
    documents: [
      {
        title: "6.0 Utah Sleep Study",
        storagePath:
          "Clinical Evidence/6.0 Utah Sleep Study Report Release.pdf",
      },
      {
        title: "Clinical Trials - DASS 21",
        storagePath:
          "Clinical Evidence/Clinical Trials - DASS 21- Results Analysis.pdf",
      },
      {
        title: "Clinical Trials - Sleep Study Analysis",
        storagePath:
          "Clinical Evidence/Clinical Trials - Sleep Study Results Analysis.pdf",
      },
      {
        title: "JCSM AASM",
        storagePath:
          "Clinical Evidence/JCSM AASM anderson-et-al-2025-a-randomized-pilot-study-of-a-wearable-device-using-variable-complex-weak-magnetic-fields-among.pdf",
      },
      {
        title: "Sleep Study Clinical Trials",
        storagePath:
          "Clinical Evidence/Sleep Study Clinical Trials - Results Analysis.pdf",
      },
    ],
  },
  {
    id: "method-of-action",
    title: "Mechanism of Action",
    icon: "database",
    color: "var(--mustard)",
    description:
      "Scientific explanations, pathways, and visual representations illustrating how Evolv28 works.",
    documents: [
      {
        title: "Alpha - Sleep",
        storagePath: "Mechanism of Action (MoA)/Alpha - Sleep.gif",
      },
      {
        title: "Beta - Concentration",
        storagePath: "Mechanism of Action (MoA)/Beta - Concentration.gif",
      },
      { title: "MOA_1", storagePath: "Mechanism of Action (MoA)/MOA_1.pdf" },
    ],
  },
  {
    id: "patent",
    title: "Patent",
    icon: "shield-check",
    color: "var(--lavender)",
    description:
      "Patent publications and intellectual property documentation supporting Evolv28 innovations.",
    documents: [
      {
        title: "Evolv28 Patent",
        storagePath: "Patent/Patent EVOLV28 (US Copy online).pdf",
      },
    ],
  },
];

// --- 3. GATING LOGIC WITH LOCALSTORAGE & PREMIUM VALIDATION ---
window.gateSubmitted = false;

const gateForm = document.getElementById("gateForm");
const nameField = document.getElementById("nameField");
const emailField = document.getElementById("emailField");
const formError = document.getElementById("formError");
const formErrorText = document.getElementById("formErrorText");
const gateBackdrop = document.getElementById("gateBackdrop");

if (gateForm) {
  gateForm.addEventListener("submit", (e) => {
    const nameValue = nameField.value.trim();
    const emailValue = emailField.value.trim();

    nameField.classList.remove("input-error");
    emailField.classList.remove("input-error");
    formError.style.display = "none";

    if (!nameValue || !emailValue) {
      e.preventDefault();
      if (!nameValue) nameField.classList.add("input-error");
      if (!emailValue) emailField.classList.add("input-error");
      formErrorText.textContent =
        "Please provide both your name and a valid email address.";
      formError.style.display = "flex";
      if (window.lucide) lucide.createIcons();
      window.gateSubmitted = false;
      return;
    }
    window.gateSubmitted = true;
  });

  [nameField, emailField].forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("input-error");
      formError.style.display = "none";
    });
  });
}

if (localStorage.getItem("evolv28_hub_unlocked") === "true") {
  if (gateBackdrop) {
    gateBackdrop.style.display = "none";
  }
  document.body.classList.remove("gated-mode");
}

window.unlockHub = function () {
  const gateFormContainer = document.getElementById("gateFormContainer");
  const gateSuccess = document.getElementById("gateSuccessMessage");

  localStorage.setItem("evolv28_hub_unlocked", "true");
  gateFormContainer.style.opacity = "0";

  setTimeout(() => {
    gateFormContainer.style.display = "none";
    gateSuccess.style.display = "flex";
    setTimeout(() => {
      gateSuccess.style.opacity = "1";
    }, 50);

    setTimeout(() => {
      gateBackdrop.style.opacity = "0";
      setTimeout(() => {
        gateBackdrop.style.visibility = "hidden";
        gateBackdrop.style.display = "none";
        document.body.classList.remove("gated-mode");
      }, 600);
    }, 1500);
  }, 400);
};

// --- 4. HUB INITIALIZATION LOGIC ---
const categoryMenu = document.getElementById("categoryMenu");
const categorySelect = document.getElementById("categorySelect");
const catIconContainer = document.getElementById("catIconContainer");
const catIcon = document.getElementById("catIcon");
const catTitle = document.getElementById("catTitle");
const catDesc = document.getElementById("catDesc");
const documentsContainer = document.getElementById("documentsContainer");

function initializeHub() {
  categoryMenu.innerHTML = "";
  categorySelect.innerHTML = "";

  const defaultOpt = document.createElement("option");
  defaultOpt.value = "home";
  defaultOpt.textContent = "Home / Overview";
  categorySelect.appendChild(defaultOpt);

  resources.forEach((item, index) => {
    const btn = document.createElement("button");
    btn.className = `category-btn`;
    btn.textContent = item.title;

    btn.onclick = () => {
      document
        .querySelectorAll(".category-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      categorySelect.value = item.id;
      loadCategory(item);
    };
    categoryMenu.appendChild(btn);

    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.title;
    categorySelect.appendChild(opt);
  });

  const extBtn = document.createElement("button");
  extBtn.className = "category-btn btn-onboarding";
  extBtn.style.marginTop = "1rem";
  extBtn.innerHTML = `<span>App Onboarding</span> <i data-lucide="external-link" class="icon-sm"></i>`;
  extBtn.onclick = () => window.open("onboarding.html", "_blank");
  categoryMenu.appendChild(extBtn);

  const contactBtn = document.createElement("button");
  contactBtn.className = "category-btn btn-contact";
  contactBtn.style.marginTop = "0.5rem";
  contactBtn.innerHTML = `<span>Contact Us</span> <i data-lucide="mail" class="icon-sm"></i>`;
  contactBtn.onclick = () => {
    document
      .querySelectorAll(".category-btn")
      .forEach((b) => b.classList.remove("active"));
    contactBtn.classList.add("active");
    categorySelect.value = "contact";
    showContactState();
  };
  categoryMenu.appendChild(contactBtn);

  const contactOpt = document.createElement("option");
  contactOpt.value = "contact";
  contactOpt.textContent = "Contact Us";
  categorySelect.appendChild(contactOpt);

  categorySelect.addEventListener("change", (e) => {
    const selectedId = e.target.value;

    if (selectedId === "home") {
      document
        .querySelectorAll(".category-btn")
        .forEach((b) => b.classList.remove("active"));
      showHomeState();
      return;
    }

    if (selectedId === "contact") {
      document
        .querySelectorAll(".category-btn")
        .forEach((b) => b.classList.remove("active"));
      contactBtn.classList.add("active");
      showContactState();
      return;
    }

    const selectedItem = resources.find((r) => r.id === selectedId);
    if (selectedItem) {
      document.querySelectorAll(".category-btn").forEach((b) => {
        b.classList.toggle("active", b.textContent === selectedItem.title);
      });
      loadCategory(selectedItem);
    }
  });

  showHomeState();
  if (window.lucide) lucide.createIcons();
}

function showContactState() {
  const categoryHeader = document.querySelector(".category-header");
  if (categoryHeader) categoryHeader.style.display = "none";

  documentsContainer.innerHTML = `
    <div class="home-state-container" style="min-height: 60vh;">
      <div class="icon-container-large" style="background: rgba(241, 121, 97, 0.1); margin-bottom: 2rem;">
        <i data-lucide="mail" style="width: 32px; height: 32px; color: var(--accent-primary);"></i>
      </div>
      <h1 class="home-state-title" style="font-size: 2.4rem; margin-bottom: 1rem;">
        Start a <span class="text-coral">conversation.</span>
      </h1>
      <p class="home-state-desc" style="margin-bottom: 3rem; max-width: 600px;">
        Whether you're exploring Evolv28 for research, partnership, or your own practice, we'd be glad to connect.
      </p>
      <a href="mailto:info@aethermt.com" class="btn btn-primary" style="text-decoration: none; padding: 1rem 2rem; font-size: 1.05rem;">
        <i data-lucide="send" class="icon-sm"></i> info@aethermt.com
      </a>
    </div>
  `;

  if (window.lucide) lucide.createIcons();
  const hubContent = document.getElementById("hubContent");
  if (hubContent)
    hubContent.scrollIntoView({ behavior: "smooth", block: "start" });
}

// --- 5. DYNAMIC FIREBASE ACCORDION FETCHING (Lazy Load) ---
function loadCategory(item) {
  const categoryHeader = document.querySelector(".category-header");
  if (categoryHeader) categoryHeader.style.display = "flex";

  catIcon.setAttribute("data-lucide", item.icon);
  catIconContainer.style.backgroundColor = item.color;
  catTitle.textContent = item.title;
  catDesc.textContent = item.description;

  documentsContainer.innerHTML = "";

  if (item.documents && item.documents.length > 0) {
    item.documents.forEach((doc, index) => {
      // 1. Create the Accordion Item wrapper
      const accordionItem = document.createElement("div");
      accordionItem.className = "accordion-item";

      // 2. Build the Accordion Header and hidden Content block
      accordionItem.innerHTML = `
        <div class="accordion-header" id="acc-header-${item.id}-${index}">
          <div class="doc-title-wrapper">
            <div class="doc-number">${index + 1}</div>
            <h3>${doc.title}</h3>
          </div>
          <div class="accordion-icon">
            <i data-lucide="chevron-down"></i>
          </div>
        </div>
        <div class="accordion-content" id="acc-content-${item.id}-${index}">
          <div class="accordion-content-inner">
            <div class="doc-iframe-wrapper" id="iframe-wrapper-${
              item.id
            }-${index}">
              <div style="display:flex; height:100%; width:100%; align-items:center; justify-content:center; background:var(--bg-main); color:var(--text-muted); font-family:'Montserrat', sans-serif;">
                <i data-lucide="loader-2" class="icon-sm" style="animation: spin 2s linear infinite; margin-right: 8px;"></i>
                Loading...
              </div>
            </div>
          </div>
        </div>
      `;
      documentsContainer.appendChild(accordionItem);

      // 3. Attach Click & Lazy Load Logic
      const header = document.getElementById(`acc-header-${item.id}-${index}`);
      const content = document.getElementById(
        `acc-content-${item.id}-${index}`
      );
      const iframeWrapper = document.getElementById(
        `iframe-wrapper-${item.id}-${index}`
      );

      let isLoaded = false;

      header.addEventListener("click", () => {
        // Toggle the visual active states
        header.classList.toggle("active");
        content.classList.toggle("expanded");
        accordionItem.classList.toggle("active-item");

        // If expanding and hasn't been loaded yet, fetch from Firebase!
        if (header.classList.contains("active") && !isLoaded) {
          const fileRef = ref(storage, doc.storagePath);

          getDownloadURL(fileRef)
            .then((url) => {
              iframeWrapper.innerHTML = `
                <iframe src="${url}#toolbar=0&navpanes=0&view=FitH" loading="lazy" frameborder="0" allowfullscreen></iframe>
              `;
              isLoaded = true;
            })
            .catch((error) => {
              console.error(`Error loading ${doc.title}:`, error);
              iframeWrapper.innerHTML = `
                <div style="display:flex; height:100%; width:100%; align-items:center; justify-content:center; background:rgba(241, 121, 97, 0.05); color:var(--coral); font-family:'Montserrat', sans-serif;">
                  <i data-lucide="alert-circle" class="icon-sm" style="margin-right: 8px;"></i>
                  File not found or access denied. Please verify the storage path.
                </div>
              `;
            });
        }
      });
    });
  } else {
    documentsContainer.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1rem; height:300px; align-items:center; justify-content:center; font-family:'Montserrat', sans-serif; color:var(--text-muted); background:var(--bg-main); border-radius: 20px; border: 1px dashed var(--border-medium);">
        <i data-lucide="folder-open" style="width:48px; height:48px; opacity:0.5;"></i>
        <p>Documentation pending upload.</p>
      </div>`;
  }

  if (window.lucide) lucide.createIcons();
}

function showHomeState() {
  const categoryHeader = document.querySelector(".category-header");
  if (categoryHeader) categoryHeader.style.display = "none";

  documentsContainer.innerHTML = `
    <div class="home-state-container">
    <div class="home-hero-image">
        <img src="images/device.gif" alt="Evolv28 Overview" />
      </div>
      <h1 class="home-state-title">
        The definitive home for <span class="text-coral">Evolv28.</span>
      </h1>
      <p class="home-state-desc">
       The science of a calmer mind. Evolv28 began with a single idea: that the brain can be guided gently back to rest. Here you'll find everything that idea grew into — the technology, the proof, the product, and the credentials — gathered in one place and kept current.
      </p>
    </div>
  `;
}

// Start the app
initializeHub();
