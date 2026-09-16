(function(){
  function safeDecode(s){
    if(!s) return '';
    try { return decodeURIComponent(s.replace(/\+/g,' ')); }
    catch(e){
      // fallback: escape stray '%' then try again
      try {
        const fixed = s.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
        return decodeURIComponent(fixed.replace(/\+/g,' '));
      } catch(e2){
        // last fallback: return raw but with plus -> space
        return s.replace(/\+/g,' ');
      }
    }
  }

  var qs = window.location.search.replace(/^\?/,'');
  if(!qs) return;
  var pairs = qs.split('&');
  var params = {};
  pairs.forEach(function(p){
    if(!p) return;
    var parts = p.split('=');
    var k = parts.shift();
    var v = parts.join('='); // rejoin in case value contained =
    params[k] = safeDecode(v || '');
  });

  // common keys we expect in your form
  var usernameKeys = ['username','user','email','student_username','studentUsername'];
  var passwordKeys = ['password','pass','pwd','student_password','studentPassword'];

  var usernameVal = null, passwordVal = null;
  usernameKeys.some(function(k){ if(params[k]){ usernameVal = params[k]; return true; }});
  passwordKeys.some(function(k){ if(params[k]){ passwordVal = params[k]; return true; }});

  function setIfFound(selectors, value){
    if(!value) return false;
    for(var i=0;i<selectors.length;i++){
      var el = document.querySelector(selectors[i]);
      if(el){
        el.value = value;
        // trigger input/change so frameworks pick it up
        el.dispatchEvent(new Event('input', {bubbles:true}));
        el.dispatchEvent(new Event('change', {bubbles:true}));
        return true;
      }
    }
    return false;
  }

  if(usernameVal){
    setIfFound(['input[name="username"]','input#username','input[name="email"]','input[name="user"]','input[name="student_username"]','input[name="studentUsername"]'], usernameVal);
  }
  if(passwordVal){
    setIfFound(['input[name="password"]','input#password','input[name="pass"]','input[name="pwd"]','input[name="student_password"]','input[name="studentPassword"]'], passwordVal);
  }

  // optional: if role tab exists, try to click it
  if(params['role']){
    var role = params['role'];
    var roleBtn = document.querySelector('[data-role="'+role+'"], button[data-role="'+role+'"], input[data-role="'+role+'"], .role-tab[role="'+role+'"]');
    if(roleBtn) roleBtn.click();
  }
})();
