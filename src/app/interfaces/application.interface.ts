export interface Leads {
    id: string;
    referralsReferralNum: Referrals;
    estMargin: number;
    fName: string;
    lName: string;
    phone: number;
    email: string;
    status: number;
    referred: boolean;
    accessMethod: number;
    firstSeen: string;
    appStart: string;
    appsubmit: string;
    compQuote: boolean;
    compSales: number;
    compFeature: number;
    compStatement: string;
    rateFee: number;
    ratePercent: number;
    currentProcessor: string;
    prefContact: number;
    applications: Referrals;
    devices: Devices;
    oauthClients: OauthClients;

}

export interface Devices {
    id: string;
    applicationAppId: Application;
    leadsIdNum: Leads;
    deviceFingerprint: string;
    accessMethod: number;
    operatingSystem: string;
    browser: string;
    cookiesEnabled: boolean;
    timeZone: string;
    display: string;
    language: string;
    ipAddress: string;
    locate: string;
}

export interface OauthClients {
    id: string;
    userId: string;
    leadsId: string;
    name: string;
    secret: string;
    redirect: string;
    personalAccessClient: boolean;
    passwordClient: boolean;
    revoked: boolean;
}

export interface Referrals {
    id: string;
    referralNum: string;
    active: boolean;
    makeVip: boolean;
    posRate: number;
    posTransactionFee: number;
    swipeRate: number;
    mobileRate: number;
    mobileTransactionFee: number;
    onlineRate: number;
    onlineTransactionFee: number;
    sendTo: boolean;
    mobileNonqualFee: number;
    onlineNonqualRate: number;
    onlineNonqualFee: number;
    swipeNonqualRate: number;
    applications: Application;
    leads: Leads;
}

export interface Owners {
    id: string;
    applicationAppId: Application;
    social: number;
    name: string;
    dob: string;
    percentOwned: number;
    resAddy1: string;
    resAddy2: string;
    resCity: string;
    resState: string;
    resZip: boolean;
    resPhone: number;
}

export interface Banking {
    id: string;
    applicationAppId: Application;
    accountNumber: number;
    bankName: string;
    bankPhone: number;
    routingNumber: number;
    accountType: number;
    dailySettle: boolean;
    monthlyBilling: boolean;
    chargeback: boolean;
    achSettle: boolean;
    achFees: boolean;
    defaultAccount: boolean;
}

export interface Addresses {
    id: string;
    applicationAppId: Application;
    addressType: number;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipcode: number;
    placeId: string;
}

export interface CardProcessing {
    id: string;
    applicationAppId: Application;
    acceptCards: boolean;
    currentProcessor: string;
    locationNum: boolean;
    addLocations: boolean;
    billBeforeShip: boolean;
    daysBill: number;
    allowRefunds: boolean;
    cardTypes: number;
    swipedPercent: number;
    keyed_percent: number;
    imprint_percent: number;
    ecommPercent: number;
    b2bPercent: number;
    monthlySales: number;
    averageTransaction: number;
    goodServe: boolean;
}

export interface Specialities {
    id: string;
    applicationAppId: Application;
    ownEquipment: boolean;
    specificIndustry: number;
}

export interface Equipment {
    id: string;
    applicationAppId: Application;
    ownTerminal: boolean;
    needTerminal: boolean;
    needPinpad: boolean;
    buyTerminal: boolean;
    freeTerminal: boolean;
    echoPos: boolean;
    mobileSwipe: boolean;
    shipTo: number;
    shippingAddress: string;
    selectEquipment: boolean;
}

export interface EquipmentDetail {
    id: string;
    applicationAppId: Application;
    brand: string;
    model: string;
    serialNumber: string;
}

export interface Sales {
    id: string;
    applicationAppId: Application;
    industry: number;
    mccSic: number;
    retailLoc: boolean;
    mobileLoc: boolean;
    onlineLoc: boolean;
    goodServe: boolean;
    priorDelivery: boolean;
    advanceTime: number;
    refundPolicy: boolean;
    refundDescr: string;
    refundLink: string;
    acceptCards: boolean;
    thirdParty: boolean;
    thirdPartyName: string;
    moto: boolean;
    otherIndustryType: string;
    needEquipment: boolean;
    specificIndustry: number;
}

export interface Identification {
    id: string;
    applicationAppId: Application;
    idType: boolean;
    personalIdCategory: number;
    businessIdCategory: number;
    idNumber: string;
    issueDate: string;
    expireDate: string;
    issuedBy: string;
    date: string;
    fileNum: number;
}

export interface Contacts {
    id: string;
    applicationAppId: Application;
    email: string;
    statements: string;
    chargeback: string;
    edocConsent: boolean;
    noticesTax: string;
    certDisclosures: boolean;
    certNotices: boolean;
    certApplication: boolean;
}

export interface Seasonal {
    id: string;
    applicationAppId: Application;
    jan: boolean;
    feb: boolean;
    mar: boolean;
    apr: boolean;
    may: boolean;
    jun: boolean;
    jul: boolean;
    aug: boolean;
    sep: boolean;
    oct: boolean;
    nov: boolean;
    dec: boolean;
}

export interface ApplicationStatus {
    id: string;
    applicationAppId: Application;
    requestApi: string;
    args: string;
    count: number;
    createDate: string;
}

export interface Application {
    id: string;
    referralsReferralNum: Referrals;
    lead: Leads;
    applicationStatus: number;
    vip: number;
    uniqueCode: string;
    password: string;
    businessName: string;
    ownershipType: number;
    businessBirthday: string;
    businessPhone: number;
    businessFax: string;
    gotDba: boolean;
    dbaName: string;
    dbaPhone: number;
    dbaFax: string;
    customerServicePhone: number;
    website: string;
    chargebackContactName: string;
    chargebackContactTitle: string;
    chargebackContactPhone: number;
    businessBankrupt: boolean;
    businessBankruptDate: string;
    personalBankrupt: boolean;
    personalBankruptDate: string;
    taxIdNum: string;
    taxName: string;
    exemptPayee: boolean;
    hasDba: boolean;
    dbaName1: string;
    seasonal: boolean;
    numOwners: boolean;
    saleType: boolean;
    authNet: boolean;
    devices: Devices;
    owners: Owners;
    banking: Banking;
    addresses: Addresses;
    cardProcessing: CardProcessing;
    specialities: Specialities;
    equipment: Equipment;
    equipmentDetail: EquipmentDetail;
    sales: Sales;
    identification: Identification;
    contacts: Contacts;
    seasonalKey: Seasonal;
    applicationStatuss: ApplicationStatus;
}
