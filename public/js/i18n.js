// i18n.js — Meertaligheid / Mehrsprachigkeit / Multi-language (NL / DE / EN)

const TRANSLATIONS = {
  nl: {
    // Header
    shopName: 'Bakkerij',
    adminLink: 'Beheer',
    cart: 'Winkelwagen',
    orderPage: 'Bestelpagina',
    platform: 'Platform',

    // Menu (klant)
    ourMenu: 'Ons Menu',
    menuLoading: 'Menu laden...',
    menuError: 'Kon het menu niet laden. Controleer of de server actief is.',
    addToCart: '+ Toevoegen',

    // Winkelwagen
    cartTitle: 'Winkelwagen',
    cartClose: 'Sluiten',
    cartEmpty: 'Je winkelwagen is leeg.',
    total: 'Totaal',

    // Bestelformulier
    deliveryDetails: 'Bezorggegevens',
    name: 'Naam',
    namePlaceholder: 'Voornaam Achternaam',
    phone: 'Telefoonnummer',
    phonePlaceholder: '06-12345678',
    address: 'Bezorgadres',
    addressPlaceholder: 'Straat 1, Stad',
    deliveryTime: 'Gewenste bezorgtijd',
    deliveryTimePlaceholder: 'Bijv. 12:00 of Zo snel mogelijk',
    placeOrder: 'Bestelling plaatsen',

    // Bevestiging
    thankYou: 'Bedankt voor je bestelling!',
    newOrder: 'Nieuwe bestelling',

    // Validatie
    fillRequired: 'Vul je naam, telefoonnummer en bezorgadres in.',
    cartEmptyError: 'Je winkelwagen is leeg.',
    orderError: 'Er ging iets mis. Probeer opnieuw.',
    connectionError: 'Kon de bestelling niet plaatsen. Controleer je verbinding.',

    // Admin — Algemeen
    adminTitle: 'Bakkerij — Beheer',

    // Admin — Tabs
    orders: 'Bestellingen',
    menuManagement: 'Menu beheer',
    statistics: 'Statistieken',
    settings: 'Instellingen',

    // Admin — Bestellingen
    ordersTitle: 'Bestellingen',
    refresh: 'Vernieuwen',
    ordersLoading: 'Bestellingen laden...',
    ordersError: 'Kon bestellingen niet laden.',
    noOrders: 'Geen bestellingen gevonden.',
    filterAll: 'Alle',
    filterNew: 'Nieuw',
    filterProcessing: 'In behandeling',
    filterDelivered: 'Bezorgd',
    deliveryTimeLabel: 'Bezorgtijd',
    statusUpdateError: 'Kon status niet bijwerken.',

    // Admin — Menu
    menuTitle: 'Menu beheer',
    addItem: '+ Item toevoegen',
    menuLoading2: 'Menu laden...',
    menuError2: 'Kon menu niet laden.',
    noMenuItems: 'Geen menu-items gevonden.',
    edit: 'Bewerken',
    delete: 'Verwijderen',

    // Admin — Menu modal
    addMenuTitle: 'Menu-item toevoegen',
    editMenuTitle: 'Menu-item bewerken',
    itemName: 'Naam',
    itemNamePlaceholder: 'Bijv. Kaas',
    itemDesc: 'Omschrijving',
    itemDescPlaceholder: 'Bijv. Vers broodje met belegen kaas',
    itemPrice: 'Prijs (€)',
    itemPricePlaceholder: '2.50',
    itemPhoto: 'Foto (optioneel)',
    itemPhotoSelect: 'Foto kiezen',
    itemPhotoRemove: 'Foto verwijderen',
    cancel: 'Annuleren',
    save: 'Opslaan',
    requiredError: 'Naam en prijs zijn verplicht.',
    saveError: 'Opslaan mislukt.',
    saveErrorConn: 'Kon menu-item niet opslaan.',
    deleteConfirm: 'Weet je zeker dat je "{name}" wilt verwijderen?',
    deleteError: 'Verwijderen mislukt.',
    deleteErrorConn: 'Kon menu-item niet verwijderen.',

    // Admin — Statistieken
    statsTitle: 'Statistieken',
    todayOrders: 'Bestellingen vandaag',
    todayRevenue: 'Omzet vandaag',
    weekOrders: 'Bestellingen deze week',
    weekRevenue: 'Omzet deze week',
    statusOverview: 'Status overzicht',
    statsLoading: 'Statistieken laden...',
    statsError: 'Kon statistieken niet laden.',

    // Admin — Instellingen
    settingsTitle: 'Winkelinstellingen',
    shopNameLabel: 'Winkelnaam',
    shopNamePlaceholder: 'Bijv. Bakkerij De Gouden Korst',
    taglineLabel: 'Slogan (optioneel)',
    taglinePlaceholder: 'Bijv. Vers gebakken elke dag',
    logoLabel: 'Logo (optioneel)',
    logoSelect: 'Logo kiezen',
    logoRemove: 'Logo verwijderen',
    primaryColorLabel: 'Hoofdkleur',
    secondaryColorLabel: 'Achtergrondkleur',
    accentColorLabel: 'Accentkleur',
    languageLabel: 'Taal',
    saveSettings: 'Instellingen opslaan',
    settingsSaved: 'Instellingen opgeslagen!',
    settingsError: 'Kon instellingen niet opslaan.',
    settingsLoading: 'Instellingen laden...',
    colorPreview: 'Kleurvoorbeeld',
    resetColors: 'Standaardkleuren',

    // Platform
    platformTitle: 'Platform Beheer',
    bakeries: 'Bakkerijen',
    platformStats: 'Platform Statistieken',
    billing: 'Facturatie',
    addBakery: '+ Bakkerij toevoegen',
    editBakery: 'Bakkerij bewerken',
    invoices: 'Facturen',
    createInvoice: 'Factuur aanmaken',
    nameRequired: 'Naam is verplicht.',
    saveBakeryError: 'Kon bakkerij niet opslaan.',
    toggleConfirm: 'Weet je zeker dat je deze bakkerij wilt {action}?',
    deactivate: 'deactiveren',
    activate: 'activeren',
    toggleError: 'Kon status niet wijzigen.',
    invoiceSelectError: 'Selecteer een bakkerij en vul de periode in.',
    invoiceCreateError: 'Factuur aanmaken mislukt.',
    invoiceConnError: 'Kon factuur niet aanmaken.',
    invoiceStatusError: 'Kon status niet bijwerken.',

    // Platform — kaarten
    active: 'Actief',
    inactive: 'Inactief',
    billing_label: 'Facturatie',
    monthly: 'Maandelijks',
    yearly: 'Jaarlijks',
    perMonth: '/ maand',
    perOrder: 'per bestelling',
    editBtn: 'Bewerken',
    invoiceBtn: 'Factuur',
    deactivateBtn: 'Deactiveren',
    activateBtn: 'Activeren',
    noBakeries: 'Nog geen bakkerijen geregistreerd.',

    // Platform — statistieken
    totalBakeries: 'Totaal bakkerijen',
    activeSub: 'actief',
    totalOrders: 'Totaal bestellingen',
    platformWide: 'Platform breed',
    platformRevenue: 'Platform omzet (betaald)',
    billedPaid: 'Gefactureerd & betaald',
    perBakery: 'Per bakkerij',
    colBakery: 'Bakkerij',
    colStatus: 'Status',
    colOrders: 'Bestellingen',
    colRevenue: 'Orderomzet',
    colBilled: 'Gefactureerd (betaald)',
    noBakeriesStats: 'Geen bakkerijen gevonden.',
    statsLoadError: 'Kon statistieken niet laden.',

    // Platform — facturen
    colInvoiceNr: 'Factuurnummer',
    colBakeryName: 'Bakkerij',
    colPeriod: 'Periode',
    colSubtotal: 'Subtotaal',
    colVat: 'BTW (21%)',
    colTotal: 'Totaal',
    colInvStatus: 'Status',
    colActions: 'Acties',
    sendInvoice: 'Versturen',
    markPaid: 'Markeer betaald',
    noInvoices: 'Geen facturen gevonden.',
    invoicesLoading: 'Facturen laden...',
    invoicesError: 'Kon facturen niet laden.',

    // Platform — bakkerij modal
    addBakeryTitle: 'Bakkerij toevoegen',
    editBakeryTitle: 'Bakkerij bewerken',
    contactPerson: 'Contactpersoon',
    email: 'E-mail',
    phoneLbl: 'Telefoon',
    addressLbl: 'Adres',
    subscription: 'Abonnement',
    monthlyFee: 'Maandelijks abonnementsgeld (€)',
    perOrderFee: 'Kosten per bestelling (€)',
    startDate: 'Startdatum abonnement',
    selectBakery: '-- Selecteer bakkerij --',
    periodFrom: 'Periode van',
    periodTo: 'Periode tot',
    exampleCalc: 'Voorbeeldberekening',
    monthlySubscription: 'Maandabonnement',
    orderCosts: 'Bestellingskosten',
    variable: 'variabel',
    vat: 'BTW (21%)',
    minTotal: 'Totaal (minimaal)',

    // Taalnamen
    langNL: 'Nederlands',
    langDE: 'Deutsch',
    langEN: 'English',

    // Diversen
    orderCountSingle: '{count} bestelling',
    orderCountPlural: '{count} bestellingen',
    confirmationText: 'Hoi {name}, je bestelling wordt bezorgd op {address}. Bezorgtijd: {time}.',
    asap: 'Zo snel mogelijk',
    loading: 'Laden...',
    yes: 'Ja',
    no: 'Nee',
  },

  de: {
    shopName: 'Bäckerei',
    adminLink: 'Verwaltung',
    cart: 'Warenkorb',
    orderPage: 'Bestellseite',
    platform: 'Plattform',

    ourMenu: 'Unser Menü',
    menuLoading: 'Menü wird geladen...',
    menuError: 'Das Menü konnte nicht geladen werden. Überprüfen Sie, ob der Server aktiv ist.',
    addToCart: '+ Hinzufügen',

    cartTitle: 'Warenkorb',
    cartClose: 'Schließen',
    cartEmpty: 'Ihr Warenkorb ist leer.',
    total: 'Gesamt',

    deliveryDetails: 'Lieferdaten',
    name: 'Name',
    namePlaceholder: 'Vorname Nachname',
    phone: 'Telefonnummer',
    phonePlaceholder: '06-12345678',
    address: 'Lieferadresse',
    addressPlaceholder: 'Straße 1, Stadt',
    deliveryTime: 'Gewünschte Lieferzeit',
    deliveryTimePlaceholder: 'z.B. 12:00 oder So schnell wie möglich',
    placeOrder: 'Bestellung aufgeben',

    thankYou: 'Vielen Dank für Ihre Bestellung!',
    newOrder: 'Neue Bestellung',

    fillRequired: 'Bitte geben Sie Ihren Namen, Ihre Telefonnummer und Ihre Lieferadresse ein.',
    cartEmptyError: 'Ihr Warenkorb ist leer.',
    orderError: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    connectionError: 'Bestellung konnte nicht aufgegeben werden. Überprüfen Sie Ihre Verbindung.',

    adminTitle: 'Bäckerei — Verwaltung',

    orders: 'Bestellungen',
    menuManagement: 'Menüverwaltung',
    statistics: 'Statistiken',
    settings: 'Einstellungen',

    ordersTitle: 'Bestellungen',
    refresh: 'Aktualisieren',
    ordersLoading: 'Bestellungen werden geladen...',
    ordersError: 'Bestellungen konnten nicht geladen werden.',
    noOrders: 'Keine Bestellungen gefunden.',
    filterAll: 'Alle',
    filterNew: 'Neu',
    filterProcessing: 'In Bearbeitung',
    filterDelivered: 'Geliefert',
    deliveryTimeLabel: 'Lieferzeit',
    statusUpdateError: 'Status konnte nicht aktualisiert werden.',

    menuTitle: 'Menüverwaltung',
    addItem: '+ Artikel hinzufügen',
    menuLoading2: 'Menü wird geladen...',
    menuError2: 'Menü konnte nicht geladen werden.',
    noMenuItems: 'Keine Menüartikel gefunden.',
    edit: 'Bearbeiten',
    delete: 'Löschen',

    addMenuTitle: 'Menüartikel hinzufügen',
    editMenuTitle: 'Menüartikel bearbeiten',
    itemName: 'Name',
    itemNamePlaceholder: 'z.B. Käse',
    itemDesc: 'Beschreibung',
    itemDescPlaceholder: 'z.B. Frisches Brötchen mit Käse',
    itemPrice: 'Preis (€)',
    itemPricePlaceholder: '2.50',
    itemPhoto: 'Foto (optional)',
    itemPhotoSelect: 'Foto auswählen',
    itemPhotoRemove: 'Foto entfernen',
    cancel: 'Abbrechen',
    save: 'Speichern',
    requiredError: 'Name und Preis sind erforderlich.',
    saveError: 'Speichern fehlgeschlagen.',
    saveErrorConn: 'Menüartikel konnte nicht gespeichert werden.',
    deleteConfirm: 'Sind Sie sicher, dass Sie "{name}" löschen möchten?',
    deleteError: 'Löschen fehlgeschlagen.',
    deleteErrorConn: 'Menüartikel konnte nicht gelöscht werden.',

    statsTitle: 'Statistiken',
    todayOrders: 'Bestellungen heute',
    todayRevenue: 'Umsatz heute',
    weekOrders: 'Bestellungen diese Woche',
    weekRevenue: 'Umsatz diese Woche',
    statusOverview: 'Statusübersicht',
    statsLoading: 'Statistiken werden geladen...',
    statsError: 'Statistiken konnten nicht geladen werden.',

    settingsTitle: 'Geschäftseinstellungen',
    shopNameLabel: 'Geschäftsname',
    shopNamePlaceholder: 'z.B. Bäckerei Goldene Kruste',
    taglineLabel: 'Slogan (optional)',
    taglinePlaceholder: 'z.B. Täglich frisch gebacken',
    logoLabel: 'Logo (optional)',
    logoSelect: 'Logo auswählen',
    logoRemove: 'Logo entfernen',
    primaryColorLabel: 'Hauptfarbe',
    secondaryColorLabel: 'Hintergrundfarbe',
    accentColorLabel: 'Akzentfarbe',
    languageLabel: 'Sprache',
    saveSettings: 'Einstellungen speichern',
    settingsSaved: 'Einstellungen gespeichert!',
    settingsError: 'Einstellungen konnten nicht gespeichert werden.',
    settingsLoading: 'Einstellungen werden geladen...',
    colorPreview: 'Farbvorschau',
    resetColors: 'Standardfarben',

    platformTitle: 'Plattformverwaltung',
    bakeries: 'Bäckereien',
    platformStats: 'Plattformstatistiken',
    billing: 'Abrechnung',
    addBakery: '+ Bäckerei hinzufügen',
    editBakery: 'Bäckerei bearbeiten',
    invoices: 'Rechnungen',
    createInvoice: 'Rechnung erstellen',
    nameRequired: 'Name ist erforderlich.',
    saveBakeryError: 'Bäckerei konnte nicht gespeichert werden.',
    toggleConfirm: 'Sind Sie sicher, dass Sie diese Bäckerei {action} möchten?',
    deactivate: 'deaktivieren',
    activate: 'aktivieren',
    toggleError: 'Status konnte nicht geändert werden.',
    invoiceSelectError: 'Bitte wählen Sie eine Bäckerei und geben Sie den Zeitraum ein.',
    invoiceCreateError: 'Rechnungserstellung fehlgeschlagen.',
    invoiceConnError: 'Rechnung konnte nicht erstellt werden.',
    invoiceStatusError: 'Status konnte nicht aktualisiert werden.',

    active: 'Aktiv',
    inactive: 'Inaktiv',
    billing_label: 'Abrechnung',
    monthly: 'Monatlich',
    yearly: 'Jährlich',
    perMonth: '/ Monat',
    perOrder: 'pro Bestellung',
    editBtn: 'Bearbeiten',
    invoiceBtn: 'Rechnung',
    deactivateBtn: 'Deaktivieren',
    activateBtn: 'Aktivieren',
    noBakeries: 'Noch keine Bäckereien registriert.',

    totalBakeries: 'Bäckereien gesamt',
    activeSub: 'aktiv',
    totalOrders: 'Bestellungen gesamt',
    platformWide: 'Plattformweit',
    platformRevenue: 'Plattformumsatz (bezahlt)',
    billedPaid: 'Abgerechnet & bezahlt',
    perBakery: 'Pro Bäckerei',
    colBakery: 'Bäckerei',
    colStatus: 'Status',
    colOrders: 'Bestellungen',
    colRevenue: 'Bestellumsatz',
    colBilled: 'Abgerechnet (bezahlt)',
    noBakeriesStats: 'Keine Bäckereien gefunden.',
    statsLoadError: 'Statistiken konnten nicht geladen werden.',

    colInvoiceNr: 'Rechnungsnummer',
    colBakeryName: 'Bäckerei',
    colPeriod: 'Zeitraum',
    colSubtotal: 'Zwischensumme',
    colVat: 'MwSt. (21%)',
    colTotal: 'Gesamt',
    colInvStatus: 'Status',
    colActions: 'Aktionen',
    sendInvoice: 'Versenden',
    markPaid: 'Als bezahlt markieren',
    noInvoices: 'Keine Rechnungen gefunden.',
    invoicesLoading: 'Rechnungen werden geladen...',
    invoicesError: 'Rechnungen konnten nicht geladen werden.',

    addBakeryTitle: 'Bäckerei hinzufügen',
    editBakeryTitle: 'Bäckerei bearbeiten',
    contactPerson: 'Ansprechpartner',
    email: 'E-Mail',
    phoneLbl: 'Telefon',
    addressLbl: 'Adresse',
    subscription: 'Abonnement',
    monthlyFee: 'Monatliche Abonnementgebühr (€)',
    perOrderFee: 'Kosten pro Bestellung (€)',
    startDate: 'Abonnement-Startdatum',
    selectBakery: '-- Bäckerei auswählen --',
    periodFrom: 'Zeitraum von',
    periodTo: 'Zeitraum bis',
    exampleCalc: 'Beispielberechnung',
    monthlySubscription: 'Monatsabonnement',
    orderCosts: 'Bestellkosten',
    variable: 'variabel',
    vat: 'MwSt. (21%)',
    minTotal: 'Gesamt (mindestens)',

    langNL: 'Nederlands',
    langDE: 'Deutsch',
    langEN: 'English',

    orderCountSingle: '{count} Bestellung',
    orderCountPlural: '{count} Bestellungen',
    confirmationText: 'Hallo {name}, Ihre Bestellung wird an {address} geliefert. Lieferzeit: {time}.',
    asap: 'So schnell wie möglich',
    loading: 'Laden...',
    yes: 'Ja',
    no: 'Nein',
  },

  en: {
    shopName: 'Bakery',
    adminLink: 'Admin',
    cart: 'Cart',
    orderPage: 'Order Page',
    platform: 'Platform',

    ourMenu: 'Our Menu',
    menuLoading: 'Loading menu...',
    menuError: 'Could not load the menu. Please check if the server is running.',
    addToCart: '+ Add to Cart',

    cartTitle: 'Cart',
    cartClose: 'Close',
    cartEmpty: 'Your cart is empty.',
    total: 'Total',

    deliveryDetails: 'Delivery Details',
    name: 'Name',
    namePlaceholder: 'First Last Name',
    phone: 'Phone Number',
    phonePlaceholder: '06-12345678',
    address: 'Delivery Address',
    addressPlaceholder: 'Street 1, City',
    deliveryTime: 'Preferred Delivery Time',
    deliveryTimePlaceholder: 'e.g. 12:00 or As soon as possible',
    placeOrder: 'Place Order',

    thankYou: 'Thank you for your order!',
    newOrder: 'New Order',

    fillRequired: 'Please enter your name, phone number and delivery address.',
    cartEmptyError: 'Your cart is empty.',
    orderError: 'Something went wrong. Please try again.',
    connectionError: 'Could not place order. Please check your connection.',

    adminTitle: 'Bakery — Admin',

    orders: 'Orders',
    menuManagement: 'Menu Management',
    statistics: 'Statistics',
    settings: 'Settings',

    ordersTitle: 'Orders',
    refresh: 'Refresh',
    ordersLoading: 'Loading orders...',
    ordersError: 'Could not load orders.',
    noOrders: 'No orders found.',
    filterAll: 'All',
    filterNew: 'New',
    filterProcessing: 'Processing',
    filterDelivered: 'Delivered',
    deliveryTimeLabel: 'Delivery Time',
    statusUpdateError: 'Could not update status.',

    menuTitle: 'Menu Management',
    addItem: '+ Add Item',
    menuLoading2: 'Loading menu...',
    menuError2: 'Could not load menu.',
    noMenuItems: 'No menu items found.',
    edit: 'Edit',
    delete: 'Delete',

    addMenuTitle: 'Add Menu Item',
    editMenuTitle: 'Edit Menu Item',
    itemName: 'Name',
    itemNamePlaceholder: 'e.g. Cheese',
    itemDesc: 'Description',
    itemDescPlaceholder: 'e.g. Fresh roll with mature cheese',
    itemPrice: 'Price (€)',
    itemPricePlaceholder: '2.50',
    itemPhoto: 'Photo (optional)',
    itemPhotoSelect: 'Choose Photo',
    itemPhotoRemove: 'Remove Photo',
    cancel: 'Cancel',
    save: 'Save',
    requiredError: 'Name and price are required.',
    saveError: 'Save failed.',
    saveErrorConn: 'Could not save menu item.',
    deleteConfirm: 'Are you sure you want to delete "{name}"?',
    deleteError: 'Delete failed.',
    deleteErrorConn: 'Could not delete menu item.',

    statsTitle: 'Statistics',
    todayOrders: "Today's Orders",
    todayRevenue: "Today's Revenue",
    weekOrders: 'Orders This Week',
    weekRevenue: 'Revenue This Week',
    statusOverview: 'Status Overview',
    statsLoading: 'Loading statistics...',
    statsError: 'Could not load statistics.',

    settingsTitle: 'Shop Settings',
    shopNameLabel: 'Shop Name',
    shopNamePlaceholder: 'e.g. The Golden Crust Bakery',
    taglineLabel: 'Tagline (optional)',
    taglinePlaceholder: 'e.g. Fresh baked every day',
    logoLabel: 'Logo (optional)',
    logoSelect: 'Choose Logo',
    logoRemove: 'Remove Logo',
    primaryColorLabel: 'Primary Color',
    secondaryColorLabel: 'Background Color',
    accentColorLabel: 'Accent Color',
    languageLabel: 'Language',
    saveSettings: 'Save Settings',
    settingsSaved: 'Settings saved!',
    settingsError: 'Could not save settings.',
    settingsLoading: 'Loading settings...',
    colorPreview: 'Color Preview',
    resetColors: 'Default Colors',

    platformTitle: 'Platform Management',
    bakeries: 'Bakeries',
    platformStats: 'Platform Statistics',
    billing: 'Billing',
    addBakery: '+ Add Bakery',
    editBakery: 'Edit Bakery',
    invoices: 'Invoices',
    createInvoice: 'Create Invoice',
    nameRequired: 'Name is required.',
    saveBakeryError: 'Could not save bakery.',
    toggleConfirm: 'Are you sure you want to {action} this bakery?',
    deactivate: 'deactivate',
    activate: 'activate',
    toggleError: 'Could not change status.',
    invoiceSelectError: 'Please select a bakery and enter the period.',
    invoiceCreateError: 'Invoice creation failed.',
    invoiceConnError: 'Could not create invoice.',
    invoiceStatusError: 'Could not update status.',

    active: 'Active',
    inactive: 'Inactive',
    billing_label: 'Billing',
    monthly: 'Monthly',
    yearly: 'Yearly',
    perMonth: '/ month',
    perOrder: 'per order',
    editBtn: 'Edit',
    invoiceBtn: 'Invoice',
    deactivateBtn: 'Deactivate',
    activateBtn: 'Activate',
    noBakeries: 'No bakeries registered yet.',

    totalBakeries: 'Total Bakeries',
    activeSub: 'active',
    totalOrders: 'Total Orders',
    platformWide: 'Platform wide',
    platformRevenue: 'Platform Revenue (paid)',
    billedPaid: 'Billed & paid',
    perBakery: 'Per Bakery',
    colBakery: 'Bakery',
    colStatus: 'Status',
    colOrders: 'Orders',
    colRevenue: 'Order Revenue',
    colBilled: 'Billed (paid)',
    noBakeriesStats: 'No bakeries found.',
    statsLoadError: 'Could not load statistics.',

    colInvoiceNr: 'Invoice Number',
    colBakeryName: 'Bakery',
    colPeriod: 'Period',
    colSubtotal: 'Subtotal',
    colVat: 'VAT (21%)',
    colTotal: 'Total',
    colInvStatus: 'Status',
    colActions: 'Actions',
    sendInvoice: 'Send',
    markPaid: 'Mark as paid',
    noInvoices: 'No invoices found.',
    invoicesLoading: 'Loading invoices...',
    invoicesError: 'Could not load invoices.',

    addBakeryTitle: 'Add Bakery',
    editBakeryTitle: 'Edit Bakery',
    contactPerson: 'Contact Person',
    email: 'Email',
    phoneLbl: 'Phone',
    addressLbl: 'Address',
    subscription: 'Subscription',
    monthlyFee: 'Monthly subscription fee (€)',
    perOrderFee: 'Per order fee (€)',
    startDate: 'Subscription start date',
    selectBakery: '-- Select bakery --',
    periodFrom: 'Period from',
    periodTo: 'Period to',
    exampleCalc: 'Example calculation',
    monthlySubscription: 'Monthly subscription',
    orderCosts: 'Order costs',
    variable: 'variable',
    vat: 'VAT (21%)',
    minTotal: 'Total (minimum)',

    langNL: 'Nederlands',
    langDE: 'Deutsch',
    langEN: 'English',

    orderCountSingle: '{count} order',
    orderCountPlural: '{count} orders',
    confirmationText: 'Hi {name}, your order will be delivered to {address}. Delivery time: {time}.',
    asap: 'As soon as possible',
    loading: 'Loading...',
    yes: 'Yes',
    no: 'No',
  },
};

let _currentLang = localStorage.getItem('bakery_lang') || 'nl';

function t(key, vars = {}) {
  const dict = TRANSLATIONS[_currentLang] || TRANSLATIONS.nl;
  let str = dict[key] !== undefined ? dict[key] : (TRANSLATIONS.nl[key] || key);
  Object.entries(vars).forEach(([k, v]) => {
    str = str.split(`{${k}}`).join(String(v));
  });
  return str;
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  _currentLang = lang;
  localStorage.setItem('bakery_lang', lang);
  document.documentElement.lang = lang;
  document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

function getLang() {
  return _currentLang;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.dataset.i18nTitle);
  });
  // Update active lang button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === _currentLang);
  });
}

// Initialize language on load
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.lang = _currentLang;
  applyTranslations();

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
      applyTranslations();
      document.dispatchEvent(new Event('rerenderAll'));
    });
  });
});
