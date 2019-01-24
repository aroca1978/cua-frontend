import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
// import { HttpLink } from 'apollo-angular-link-http';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { ApolloLink, concat } from 'apollo-link';
import { HttpHeaders } from '@angular/common/http';
import { InMemoryCache } from 'apollo-cache-inmemory';


import { onError } from 'apollo-link-error';



// esto lo importo para ver si puedo solucionar lo de la renovacion del token al detectar un error

 // import { setContext } from 'apollo-link-context';





import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import gql from 'graphql-tag';
// import { Application } from '../../interfaces/application.interface';

const BUBBLES = gql`
    query bubbles {
      bubbles {
      id
      name
      textInput
      }
      }
      `;
const QUERYLEADS = gql`
mutation CreateLeadsBasicInfo(
  $fName: String!,
  $lName:String!,
  $email:String!,
  $phone: String!) {
    createLeadsBasicInfo(
      fName: $fName,
      lName: $lName,
      email: $email,
      phone: $phone) {
        id
      }
    }
    `;
const QUERYREFERRALS = gql`
query referrals($referralNum: String!) {
  referrals(referralNum: $referralNum) {
    id
  }
}
`;


const MUTCREATEAPPLICATIONBASICINFO = gql`
mutation createApplicationBasicInfo (
  $referralsReferralNum: String!, $leadsId: String!, $isIcp: Boolean ) {
    createApplicationBasicInfo (
      referralsReferralNum: $referralsReferralNum,
      leadsId: $leadsId,
      isIcp: $isIcp
    ) {
      id
    }
  }
`;

const GENERATEPARTNERTOKEN = gql`
mutation GeneratePartnerToken($grantType: String!, $scope: String!, $clientId: String!, $clientSecret: String!){
  generatePartnerToken(grantType: $grantType, scope: $scope, clientId: $clientId, clientSecret: $clientSecret) {
      accessToken
  }
}
`;

const MUTSIGNUP = gql`
mutation Signup( $email: String!, $phone: String! ) {
  signup( email: $email, phone: $phone) {
    email
    phone
    password
    client {
      id
      secret
    }
  }
}
`;


const MUTGENERATETOKEN = gql`
mutation GenerateToken(
  $grantType: String!,
  $scope: String!,
  $username: String!,
  $password: String!,
  $clientId: String!,
  $clientSecret: String!)
  {
  generateToken(
    grantType: $grantType,
    scope: $scope,
    username: $username,
    password: $password,
    clientId: $clientId,
    clientSecret: $clientSecret
  ) {
    accessToken
    refreshToken
  }
}
`;


const MUTREFRESHTOKEN = gql`
  mutation GenerateRefreshToken (
    $grantType: String!,
    $scope: String!,
    $refreshToken: String!,
    $clientId: String!,
    $clientSecret:String! ) {
      generateRefreshToken (
        grantType: $grantType,
        scope: $scope,
        refreshToken: $refreshToken,
        clientId: $clientId,
        clientSecret: $clientSecret
      ) {
        accessToken
        expiresIn
        tokenType
      }
    }
`;

const QUERYAPPLICATION = gql`
  query Application($id: String!) {
    application(id: $id) {
      id,
      referralsReferralNum {
        id,
        referralNum,
        referralName,
        active,
        makeVip,
        posRate,
        posTransactionFee,
        swipeRate
      },
      applicationStatus,
      vip,
      uniqueCode,
      password,
      businessName,
      ownershipType,
      businessBirthday,
      businessPhone,
      businessFax,
      gotDba,
      dbaName,
      dbaPhone,
      dbaFax,
      customerServicePhone,
      website,
      chargebackContactName,
      chargebackContactTitle,
      chargebackContactPhone,
      businessBankrupt,
      businessBankruptDate,
      personalBankrupt,
      addresses {
        id,
        addressType,
        address1,
        address2,
        city,
        state,
        zipcode,
        country,
        placeId
      }

    }
  }
`;

const MUTGENERATEREFRESHTOKEN = gql`
mutation GenerateRefreshToken(
  $grantType: String!, $scope: String!, $refreshToken: String!, $clientId: String!, $clientSecret: String! ) {
  generateRefreshToken(
    grantType: $grantType, scope: $scope, refreshToken: $refreshToken, clientId: $clientId, clientSecret: $clientSecret ) {
    accessToken,
    expiresIn
  }
}
`;

const MUTCREATEADDRESSES = gql`
mutation CreateAddresses(
  $applicationAppId: String!,
  $addresssType: Int!,
  $address1: String!,
  $address2: String,
  $state: String!,
  $city: String!,
  $zipCode: String!,
  $country: String!,
  $placeId: String!
) {
  createAddresses(
    applicationAppId: $applicationAppId,
    addresssType: $addresssType,
    address1: $address1,
    address2: $address2,
    state: $state,
    city: $city,
    zipCode: $zipCode,
    country: $country,
    placeId: $placeId
  ) {
    id
  }
}
`;

const UPDATEAPPBIZNAME = gql`
mutation UpdateApplicationBizName(
  $id: String!,
  $businessName: String!
){
  updateApplicationBizName(
    id: $id,
    businessName: $businessName
  ){
    id
  }
}
`;


const UPDATEAPPGOTDBA = gql`
mutation UpdateApplicationGotDba(
  $id: String!,
  $gotDba: Boolean!,
  $taxIdNum: String!,
  $taxName: String!,
){
  updateApplicationGotDba(
    id: $id,
    gotDba: $gotDba,
    taxIdNum: $taxIdNum,
    taxName: $taxName
  ){
    id
  }
  }
`;
const UPDATEAPPDBANAME = gql`
mutation UpdateApplicationDbaName($id: String!, $dbaName: String!){
  updateApplicationDbaName(id: $id, dbaName: $dbaName){
  id
  }
  }
`;
const UPDATEAPPOWNERSHIP = gql`
mutation UpdateApplicationOwnershipType($id: String!, $ownershipType: Int!, $exemptPayee: Boolean!){
  updateApplicationOwnershipType(id: $id, ownershipType: $ownershipType, exemptPayee: $exemptPayee){
  id
  }
  }
`;

const UPDATEAPPBIZINFO = gql`
mutation UpdateApplicationBizInfo($id: String!, $businessPhone: String!, $businessFax: String, $businessBirthday: String!){
    updateApplicationBizInfo(id: $id, businessPhone: $businessPhone, businessFax: $businessFax, businessBirthday: $businessBirthday){
    id
    }
    }
`;
const UPDATEAPPBANKRUPT = gql`
mutation UpdateApplicationBankrupt($id: String!,
  $personalBankrupt: Boolean!, $businessBankrupt: Boolean!, $personalBankruptDate: String, $businessBankruptDate: String){
    updateApplicationBankrupt(id: $id,
      personalBankrupt: $personalBankrupt,
      businessBankrupt: $businessBankrupt,
      personalBankruptDate: $personalBankruptDate,
      businessBankruptDate: $businessBankruptDate){
    id
    }
    }
`;
const UPDATEAPPDBAINFO = gql`
mutation UpdateApplicationDbaInfo($id: String!, $dbaPhone: String!, $dbaFax: String){
    updateApplicationDbaInfo(id: $id, dbaPhone: $dbaPhone, dbaFax: $dbaFax){
    id
    }
    }
`;

// SALES

const UPDATEAPPWEBSITE = gql`
mutation UpdateApplicationWebsite($id: String!, $website: String, $customerServicePhone: String!, $noWebsite: Boolean!){
  updateApplicationWebsite(id: $id, website: $website, customerServicePhone: $customerServicePhone, noWebsite: $noWebsite){
  id
  }
  }
`;

const QUERYINDUSTRY = gql`
query industry($name: String){
  industry(name: $name){
  id
  industry
  }
  }
`;

const CREATESALESINDUSTRY = gql`
mutation CreateSalesIndustry(
  $applicationAppId: String!,
  $goodServe: Boolean!,
  $industry: String!,
  $otherIndustryType: String,
  $serviceType: String,
  $serviceInfo: String,
  $mccSic: Int!){
    createSalesIndustry(
      applicationAppId: $applicationAppId,
      goodServe: $goodServe,
      industry: $industry,
      otherIndustryType: $otherIndustryType,
      serviceType: $serviceType,
      serviceInfo: $serviceInfo,
      mccSic: $mccSic){
        id
      }
    }
`;

const UPDATESALESBIZDESC = gql`
  mutation UpdateSalesBizDesc($id: String!, $refundDescr: String!){
  updateSalesBizDesc(id: $id, refundDescr: $refundDescr){
  id
  }
  }
`;

const UPDATESALESPAYMENTTYPE = gql`
  mutation UpdateSalesPaymentTime($id: String!, $priorDelivery: Boolean!, $advanceTime: Int!){
  updateSalesPaymentTime(id: $id, priorDelivery: $priorDelivery, advanceTime: $advanceTime){
  id
  }
  }
`;

const UPDATESALESORDERFULFILLMENT = gql `
  mutation UpdateSalesOrderFulfillment($id: String!, $thirdParty: Boolean!, $mailOrders: Boolean!){
  updateSalesOrderFulfillment(id: $id, thirdParty: $thirdParty, mailOrders: $mailOrders){
  id
  }
  }
`;

const UPDATESALESTHIRDPARTY = gql`
  mutation UpdateSalesThirdParty($id: String!, $thirdPartyName: String!){
  updateSalesThirdParty(id: $id, thirdPartyName: $thirdPartyName){
  id
  }
  }
`;

const UPDATESALESREFUND = gql`
  mutation UpdateSalesRefund($id: String!, $refundPolicy: Boolean!, $refundDescr: String, $refundLink: String){
  updateSalesRefund(id: $id, refundPolicy: $refundPolicy, refundDescr: $refundDescr, refundLink: $refundLink){
  id
  }
  }
`;

const UPDATESPECIALITIES = gql`
  mutation UpdateSpecialities($id: String!, $specificIndustry: Int!){
  updateSpecialities(id: $id, specificIndustry: $specificIndustry){
  id
  }
  }
`;

const CREATESEASONAL = gql`
  mutation CreateSeasonal(
    $applicationAppId: String!,
    $seasonal: Boolean!,
    $jan: Boolean!, $feb: Boolean!,
    $mar: Boolean!, $apr: Boolean!,
    $may: Boolean!, $jun: Boolean!,
    $jul: Boolean!, $aug: Boolean!,
    $sep: Boolean!, $oct: Boolean!,
    $nov: Boolean!, $dec: Boolean!){
  createSeasonal(
    applicationAppId: $applicationAppId,
    seasonal: $seasonal,
    jan: $jan, feb: $feb,
    mar: $mar, apr: $apr,
    may: $may, jun: $jun,
    jul: $jul, aug: $aug,
    sep: $sep, oct: $oct,
    nov: $nov, dec: $dec){
      id
    }
  }
`;
const UPDATESALESCARD = gql`
  mutation UpdateSalesCard($id: String!, $acceptCards: Boolean!, $needEquipment: Boolean!) {
    updateSalesCard(id: $id, acceptCards: $acceptCards, needEquipment: $needEquipment) {
      id
    }
  }
`;

const WEBHOSTINGSERVER = gql`
  mutation WebHostingServer($id: String!, $webHostingServer: Boolean!) {
  webHostingServer(id: $id, webHostingServer: $webHostingServer){
  id
  }
  }
`;

const AIRRESERVATION = gql`
  mutation AirReservation($id: String!, $airReservation: Boolean!){
  airReservation(id: $id, airReservation: $airReservation){
  id
  }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class ApolloService {

  // private urlGraphql = '';
  private urlGraphql = '';
  private authid = '';
  private authkey = '';
  private clientID = 'fc444ab0-b7ff-4886-9fb1-cdfb38a3e04f';
  private clientSecret = 'Rro39JWCv8rZdbpfU8RFD4Ms3CeJ0BBrZUaP23iD';
  private partnerToken = '';
  private currentTime = new Date().getTime();
  private expTime: any;
  private refNum: any;



  private accessToken: string;
  private accessTokenExp: string;
  public appID: string;
  private authKey: string;
  private partnerTokenExp: string;
  private refreshToken: string;
  public application: any;

  errors: any;
  errortype: string;


  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink
  ) {
    let HTTP = this.httpLink.create({uri: this.urlGraphql });

    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) => {
              this.errors = message;
              this.errortype = 'graphQL';
            }
          );
        }
        if (networkError) {
          this.errors = networkError;
          this.errortype = 'network';
         // networkError.
         if (this.errors.status === 401) {
           localStorage.setItem('tokentouse', 'partner');
           this.generateRefreshToken().subscribe(
             data => {
               console.log('474', data);
               if (data.accessToken) {
                 if (data.accessToken !== undefined) {
                   this.accessToken = data.accessToken;
                   localStorage.setItem('accessToken', data.accessToken);

                   const currentTime = new Date().getTime();
                   const expTime: any = currentTime + 3600000;
                   localStorage.setItem('accessTokenExpiration', expTime);
                   localStorage.setItem('tokentouse', 'access');
                }
              }
             },
             error2 => {
              console.log('477:', this.errors);
            },
            () => {
              localStorage.setItem('tokentouse', 'access');
              HTTP = httpLink.create({uri: this.urlGraphql });
            }
          );
         }

        }
      });

    const AUTHMIDDLEWARE = new ApolloLink((operation, forward) => {
      let token = '';
      // console.log(operation);
      if (localStorage.getItem('tokentouse') === 'partner') {
        if (localStorage.getItem('partnerToken')) {
          console.log('usando partner');
          token = localStorage.getItem('partnerToken');
        }
      }
      if (localStorage.getItem('tokentouse') === 'access') {
        if ((localStorage.getItem('accessToken')) && (localStorage.getItem('partnerToken'))) {
          console.log('usando access');
          token = btoa(localStorage.getItem('partnerToken') + ':' + localStorage.getItem('accessToken'));
        }
      }
      if (token !== '') {
        operation.setContext({
          headers: new HttpHeaders().set('Authorization', 'Bearer ' + token || null )
         });
       }
      return forward(operation);
    });

    const httpLinkWithErrorHandling = ApolloLink.from([
      errorLink,
      HTTP,
   ]);

    apollo.create({
      link: concat(AUTHMIDDLEWARE, httpLinkWithErrorHandling),
      cache: new InMemoryCache()
    });

   }

   connectGraphql() {
    this.apollo.query({ query: BUBBLES}).subscribe(console.log);
  }

  getPartnerToken() {
    this.apollo.mutate({ mutation: GENERATEPARTNERTOKEN, variables: {
      grantType: 'client_credentials',
      scope: '*',
      clientId: this.clientID,
      clientSecret: this.clientSecret

    }}).map((resp: any) => resp.data.generatePartnerToken ).subscribe(
      data => {
        console.log(data.accessToken);
        localStorage.setItem('partnerToken', data.accessToken);
      },
      error => {

      },
      () => {
        this.expTime = this.currentTime + 3600000;
        console.log(this.currentTime, this.expTime);

        localStorage.setItem('partnerTokenExpiration', this.expTime);
      }
    );
  }

signup( email: string, phone: string ) {
  return this.apollo.mutate(
    {
      mutation: MUTSIGNUP,
      variables: {
        'email': email,
        'phone': phone
      }
    }
  ).map(( resp: any ) => resp.data );
}

generateToken(username: string, password: string) {
  return this.apollo.mutate(
    {
      mutation: MUTGENERATETOKEN,
      variables: {
        'grantType': 'password',
        'scope': '*',
        'username': username,
        'password': password,
        'clientId': localStorage.getItem('clientid'),
        'clientSecret': localStorage.getItem('clientsecret')
      }
    }
  ).map(( resp: any) => resp.data );
}
generateRefreshToken() {
  return this.apollo.mutate(
    {
      mutation: MUTGENERATEREFRESHTOKEN,
      variables: {
        'grantType': 'refresh_token',
        'scope': '*',
        'refreshToken': localStorage.getItem('refreshToken'),
        'clientId': localStorage.getItem('clientid'),
        'clientSecret': localStorage.getItem('clientsecret')
      }
    }
  ).map(( resp: any ) => resp.data );
}
createLeadsBasicInfo(fName: string, lName: string, email: string, phone: string) {
  return this.apollo.mutate(
    {
      mutation: QUERYLEADS,
      variables: {
        'fName': fName,
        'lName': lName,
        'email': email,
        'phone': phone
      }
    }).map((resp: any) => resp.data.createLeadsBasicInfo );
  }
  createApplicationBasicInfo(referralNum: string, leadsId: string, isIcp = false) {


    return this.apollo.mutate(
      {
        mutation: MUTCREATEAPPLICATIONBASICINFO,
        variables: {
          'referralsReferralNum': referralNum,
          'leadsId': leadsId,
          'isIcp': isIcp
        }
      }).map((resp: any) => resp.data.createApplicationBasicInfo );



    }
  queryReferral(referralNum: string) {
    return this.apollo.query(
      {
        query: QUERYREFERRALS,
        variables: {
          'referralNum': referralNum
        }
      }
    ).map((resp: any) => resp.data.referrals.id );
  }

  checkLocalStorageVars () {
    if (localStorage.getItem('accessToken')) {
      this.accessToken = localStorage.getItem('accessToken');
    }
    if (localStorage.getItem('accessTokenExp')) {
      this.accessTokenExp = localStorage.getItem('accessTokenExp');
    }
    if (localStorage.getItem('appID')) {
      this.appID = localStorage.getItem('appID');
    }
    if (localStorage.getItem('authKey')) {
      this.authKey = localStorage.getItem('authKey');
    }
    if (localStorage.getItem('clientId')) {
      this.clientID = localStorage.getItem('clientId');
    }
    if (localStorage.getItem('clientSecret')) {
      this.clientSecret = localStorage.getItem('clientSecret');
    }
    if (localStorage.getItem('partnerToken')) {
      this.partnerToken = localStorage.getItem('partnerToken');
    }
    if (localStorage.getItem('partnerTokenExp')) {
      this.partnerTokenExp = localStorage.getItem('partnerTokenExp');
    }
    if (localStorage.getItem('refreshToken')) {
      this.refreshToken = localStorage.getItem('refreshToken');
    }
    if ((this.appID !== '') && (this.accessToken !== '')
        && (this.partnerToken !== '') && (this.refreshToken !== '')) {
          console.log('1');
      return true;
    } else {
      return false;
    }
  }

  getApplication( appid ): any {
    localStorage.setItem('tokentouse', 'access');
    console.log('get application:', appid);
    return this.apollo
      .query(
        {
          query: QUERYAPPLICATION,
          variables: {
            id: appid,
          },
          fetchPolicy: 'network-only'
        }
      ).map(( resp: any ) => resp.data);
  }

  getIndustries( name ): any {
    return this.apollo
      .query(
        {
          query: QUERYINDUSTRY,
          variables: {
            name: name
          },
          fetchPolicy: 'network-only'
        }
      ).map(( resp: any ) => resp.data);
  }
  getAllIndustries( ): any {
    return this.apollo
      .query(
        {
          query: QUERYINDUSTRY,
          fetchPolicy: 'network-only'
        }
      ).map(( resp: any ) => resp.data);
  }

  createAddresses(
    appid: string,
    addressType: number,
    address1: string,
    address2: string = null,
    state: string,
    city: string,
    zipCode: string,
    country: string,
    placeId: string,
  ) {
    console.log('Creating address:', 'appid: ', appid, 'addressType: ', addressType,
    'address1: ', address1, 'address2: ', address2, 'state: ', state, 'city: ', city,
    'zipCode: ', zipCode, 'country: ', country, 'placeId: ', placeId);
    return this.apollo.mutate(
      {
        mutation: MUTCREATEADDRESSES,
        variables: {
          'applicationAppId': appid,
          'addresssType': addressType,
          'address1': address1,
          'address2': address2,
          'state': state,
          'city': city,
          'zipCode': zipCode,
          'country': country,
          'placeId': placeId
        },
        refetchQueries: [{
          query: QUERYAPPLICATION,
          variables: {
            id: appid,
          }
        }]
      }).map((resp: any) => resp.data );
  }

  updateAppBizName(id: string, businessName: string) {
    return this.apollo.mutate(
      {
      mutation: UPDATEAPPBIZNAME,
      variables: {
        'id': id,
        'businessName': businessName
      }
    }).map((resp: any) => resp.data );
  }

  updateApplicationGotDba(id: string, gotDba: boolean, taxIdNum: string, taxName: string) {
    return this.apollo.mutate(
      {
        mutation: UPDATEAPPGOTDBA,
        variables: {
          'id': id,
          'gotDba': gotDba,
          'taxIdNum': taxIdNum,
          'taxName': taxName
        }
      }).map((resp: any) => resp.data );
  }

  updateApplicationDbaName( id: string, dbaName: string ) {
    return this.apollo.mutate(
      {
        mutation: UPDATEAPPDBANAME,
        variables: {
          'id': id,
          'dbaName': dbaName
        }
      }).map((resp: any) => resp.data );
  }
  updateApplicationDbaInfo( id: string, dbaPhone: number, dbaFax: number ) {
    return this.apollo.mutate(
      {
        mutation: UPDATEAPPDBAINFO,
        variables: {
          'id': id,
          'dbaPhone': dbaPhone,
          'dbaFax': dbaFax
        }
      }).map((resp: any) => resp.data );
  }

  updateApplicationOwnershipType( id: string, ownershipType: number, exemptPayee: boolean ) {
    return this.apollo.mutate(
      {
        mutation: UPDATEAPPOWNERSHIP,
        variables: {
          'id': id,
          'ownershipType': ownershipType,
          'exemptPayee': exemptPayee
        }
      }).map((resp: any) => resp.data );
  }

  updateApplicationBizInfo( id: string, businessPhone: number, businessFax: number, businessBirthday: string  ) {
    return this.apollo.mutate(
      {
        mutation: UPDATEAPPBIZINFO,
        variables: {
          'id': id,
          'businessPhone': businessPhone,
          'businessFax': businessFax,
          'businessBirthday': businessBirthday
        }
      }).map((resp: any) => resp.data );
  }
  updateApplicationBankrupt(
    id: string,
    personalBankrupt = false,
    businessBankrupt = false,
    personalBankruptDate: string,
    businessBankruptDate: string
  ) {

    if ((personalBankrupt === null) || (personalBankrupt === undefined)) {
      personalBankrupt = false;
    }
    if ((businessBankrupt === null) || (businessBankrupt === undefined)) {
      businessBankrupt = false;
    }
    if ((businessBankruptDate === null) || (businessBankruptDate === undefined)) {
      businessBankruptDate = null;
    }

    if ((personalBankruptDate === null) || (personalBankruptDate === undefined)) {
      personalBankruptDate = null;
    }
    console.log('id: ', id,
    'personalBankrupt: ', personalBankrupt,
    'businessBankrupt: ', businessBankrupt,
    'businessBankruptDate: ', businessBankruptDate,
    'personalBankruptDate: ', personalBankruptDate);
    return this.apollo.mutate(
      {
        mutation: UPDATEAPPBANKRUPT,
        variables: {
          'id': id,
          'personalBankrupt': personalBankrupt,
          'businessBankrupt': businessBankrupt,
          'personalBankruptDate': personalBankruptDate,
          'businessBankruptDate': businessBankruptDate
         }
      }).map((resp: any) => resp.data );
  }


  // SALES

  updateApplicationWebsite(
    id: string,
    website: string,
    customerServicePhone: string,
    noWebsite: boolean
    ) {
      return this.apollo.mutate(
        {
          mutation: UPDATEAPPWEBSITE,
          variables: {
            'id': id,
            'website': website,
            'customerServicePhone': customerServicePhone,
            'noWebsite': noWebsite
          }
        }
      );
    }
}
