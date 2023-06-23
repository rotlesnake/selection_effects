const tactileKeySoundAudioSrc = document.getElementById("tactileKeySound");
const linearKeySoundAudioSrc = document.getElementById("linearKeySound");
const clickyKeySoundAudioSrc = document.getElementById("clickyKeySound");

const memoryKeys = document.querySelectorAll(".memory-keys li");
const keySoundElements = document.querySelectorAll(".key-sound-switch .key-sound");
const capslockLightElement = document.querySelector(
	".info-lights .capslock-light"
);
const numlockLightElement = document.querySelector(
	".info-lights .numlock-light"
);

const logitechLogo = document.querySelector(".logitech-logo");
const lists = document.querySelectorAll(".keyboard-wrapper li");
const rootElement = document.querySelector(":root");

const colorVariants = [
	"#98ff00",
	"#ffe500",
	"#ff8100",
	"#ff0000",
	"#ff0079",
	"#c900ff",
	"#7700ff",
	"#0045ff",
	"#34edff",
	"#00ff98"
];

const keySoundVariantAudioSrc = {
	tactile: tactileKeySoundAudioSrc,
	linear: linearKeySoundAudioSrc,
	clicky: clickyKeySoundAudioSrc
};

let logoRainbowTimeout = undefined;
let currentColor = 0;
let currentColorBrightness = 0;
let currentKeySound = 'tactile';
const COLOR_BRIGHTNESS_STEP = 25;
const MIN_COLOR_BRIGHTNESS = -(COLOR_BRIGHTNESS_STEP * 3);

document.addEventListener("click", handleListClick);

document.addEventListener("keydown", handleKeydown);

document.addEventListener("keyup", handleKeyup);

window.addEventListener("blur", handleWindowBlur);

function handleListClick(event) {
	const el = event.target;
	
	if (el.className.includes("key-sound")) {
		keySoundElements.forEach((soundSwitchEl) => soundSwitchEl.classList.remove('active'));
		el.classList.add('active');
		currentKeySound = el.dataset.keySound;
	}

	if (el.localName === "li" && !el.classList.contains("round-key")) {
		keySoundVariantAudioSrc[currentKeySound].currentTime = 0;
		
keySoundVariantAudioSrc[currentKeySound].play();
	}

	if (
		el.parentNode.classList.contains("memory-keys") &&
		!el.classList.contains("memory")
	) {
		memoryKeys.forEach((keyEl) => keyEl.classList.remove("active"));
		el.classList.add("active");
		handleButtonColorChange();
	}

	if (
		el.parentNode.classList.contains("utility-keys") &&
		el.classList.contains("brightness")
	) {
		handleColorBrightness();
	}

	if (
		(el.parentNode.classList.contains("memory-keys") &&
			el.classList.contains("memory")) ||
		(el.parentNode.classList.contains("utility-keys") &&
			el.classList.contains("game"))
	) {
		el.classList.toggle("color-white");
	}

	if (
		el.parentNode.classList.contains("utility-keys") &&
		el.classList.contains("game")
	) {
		logitechLogo.classList.toggle("active");
	}

	if (
		el.parentNode.classList.contains("numpad-keys") &&
		el.classList.contains("numlock")
	) {
		numlockLightElement.classList.toggle("active");
	}

	if (
		el.parentNode.classList.contains("center-keys_row-3") &&
		el.classList.contains("caps-key")
	) {
		capslockLightElement.classList.toggle("active");
	}
}

function handleKeydown(event) {
	lists.forEach((list) => {
		if (list.dataset.key === event.code && !event.repeat) {
			list.click();
			list.classList.add("click");
		}
	});
}

function handleKeyup(event) {
	lists.forEach((list) => {
		if (list.dataset.key === event.code) {
			if (list.classList.contains("click")) {
				list.classList.remove("click");
			}
		}
	});
}

function handleButtonColorChange() {
	if (currentColor < colorVariants.length - 1) {
		currentColor++;
	} else {
		currentColor = 0;
	}
	rootElement.style.setProperty(
		"--key-text-highlight",
		shadeColor(colorVariants[currentColor], currentColorBrightness)
	);
}

function handleColorBrightness() {
	if (currentColorBrightness > MIN_COLOR_BRIGHTNESS) {
		currentColorBrightness -= COLOR_BRIGHTNESS_STEP;
	} else {
		currentColorBrightness = 0;
	}
	rootElement.style.setProperty(
		"--key-text-highlight",
		shadeColor(colorVariants[currentColor], currentColorBrightness)
	);
}

function handleWindowBlur() {
	lists.forEach((list) => {
		if (list.classList.contains("click")) {
			list.classList.remove("click");
		}
	});
}

/* 
Code snippet for shadeColor() taken from this Stack Overflow answer:
https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors/13532993#13532993
*/
function shadeColor(color, percent) {
	if (percent === MIN_COLOR_BRIGHTNESS) {
		return "#444444";
	}
	if (percent !== 0) {
		let R = parseInt(color.substring(1, 3), 16);
		let G = parseInt(color.substring(3, 5), 16);
		let B = parseInt(color.substring(5, 7), 16);

		R = parseInt((R * (100 + percent)) / 100);
		G = parseInt((G * (100 + percent)) / 100);
		B = parseInt((B * (100 + percent)) / 100);

		R = R < 255 ? R : 255;
		G = G < 255 ? G : 255;
		B = B < 255 ? B : 255;

		R = Math.round(R);
		G = Math.round(G);
		B = Math.round(B);

		let RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
		let GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
		let BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

		return "#" + RR + GG + BB;
	} else {
		return color;
	}
}