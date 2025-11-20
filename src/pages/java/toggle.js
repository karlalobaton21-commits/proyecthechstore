// function de visibilidad del ojo
document.getElementById('toggle-password').addEventListener('click',function() {
    const passwordInput=document.getElementById('password');
    const eyeOpen=document.getElementById('eye-icon-open');
    const eyeClosed=document.getElementById('eye-icon-closed');

    //verificar si la contraseña esta oculta
    const isHidden = passwordInput.type==='password';

    //cambiar de password a texto al dar click al ojo
    passwordInput.type=isHidden ? 'text': 'password';

    //alteracion del icono ojito segun del estado
    eyeOpen.classList.toggle('hidden',!isHidden);
    eyeClosed.classList.toggle('hidden', isHidden);


})