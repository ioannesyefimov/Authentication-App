const addScript = (id,src,text='')=> new Promise((resolve,reject)=>{
    const element = document.getElementById(id)
    if(element){
        return resolve(true)
    }
    const script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    if(src){
        script.setAttribute('src', src)
    }
    script.setAttribute('id', id)
    if(text){
        let inlineScript = document.createTextNode(text)
        script.appendChild(inlineScript)
    }
    script.addEventListener('load', resolve)
    script.addEventListener('error', ()=> reject(new Error(`Error loading ${id}`)))
    script.addEventListener('abort', ()=> reject(new Error*`${id} loading aborted`))
    document.getElementsByTagName('head')[0].appendChild(script)
})

export const addPolicyScript = () =>{
    const id1 = `app-policy`
    const src1 = "//cdn.iubenda.com/cs/gpp/stub.js"
    return addScript(id1,src1)
}
export const addPolicyScript2 = () =>{
    const id2 = `app-policy2`
    const src2 = "//cdn.iubenda.com/cs/iubenda_cs.js"
    return addScript(id2,src2)
}
export const addPolicyScript3 = () =>{
    const id3 = `app-policy3`
    const text2 = `      var _iub = _iub || [];
      _iub.csConfiguration =
       {"askConsentAtCookiePolicyUpdate":true,"countryDetection":true,
       "enableLgpd":true,"enableUspr":true,
       "floatingPreferencesButtonDisplay":"bottom-right",
       "gdprAppliesGlobally":false,"lang":"en",
       "lgpdAppliesGlobally":false,"perPurposeConsent":true,
       "siteId":3047503,"whitelabel":false,"cookiePolicyId":84763253, 
       "banner":{ "acceptButtonDisplay":true,"closeButtonDisplay":false,
       "customizeButtonDisplay":true,"explicitWithdrawal":true,
       "listPurposes":true,"position":"float-top-center",
       "rejectButtonDisplay":true,"showPurposesToggles":true }};`
    return  addScript(id3,'',text2)
}


export const addFacebookScript = () =>{
    const id = 'facebookAuth'
    const src = 'https://connect.facebook.net/en_US/sdk.js'
    
    return addScript(id,src)
}