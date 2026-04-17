fetch("https://script.google.com/macros/s/AKfycbyDen5PT6HtocyEKufMnpXqt51rDtX_fQYV8BeIlk_0d8eeqEntpd-KYlnbSXOLEPFY/exec")
  .then(res => res.json())
  .then(data => {
    window.REVIVE_DATA = data;
    document.dispatchEvent(new Event("REVIVE_DATA_READY"));
  });
