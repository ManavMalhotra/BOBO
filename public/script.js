const message = document.querySelector('.message a');
	const form = document.querySelector('form');

message.addEventListener('click', () => {
  form.animate({height: "toggle", opacity: "toggle"}, "slow");
});


