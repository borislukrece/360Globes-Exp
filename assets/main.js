import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

$(window).on("load", function () {
  $(".loader-container").fadeOut("slow");
});

$(document).ready(function () {
  for (let i = 0; i < 10; i++) {
    const div = $("<div>");
    div.addClass("position-absolute z-index-0 wembed");
    for (let j = 0; j < 10; j++) {
      const particleSvg = `<svg class="particle" viewBox="0 0 15 15" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
              d="M6.937 3.846L7.75 1L8.563 3.846C8.77313 4.58114 9.1671 5.25062 9.70774 5.79126C10.2484 6.3319 10.9179 6.72587 11.653 6.936L14.5 7.75L11.654 8.563C10.9189 8.77313 10.2494 9.1671 9.70874 9.70774C9.1681 10.2484 8.77413 10.9179 8.564 11.653L7.75 14.5L6.937 11.654C6.72687 10.9189 6.3329 10.2494 5.79226 9.70874C5.25162 9.1681 4.58214 8.77413 3.847 8.564L1 7.75L3.846 6.937C4.58114 6.72687 5.25062 6.3329 5.79126 5.79226C6.3319 5.25162 6.72587 4.58214 6.936 3.847L6.937 3.846Z"
              fill="black" stroke="black"
              stroke-linecap="round"
              stroke-linejoin="round"></path>
      </svg>`;
      div.append(particleSvg);
    }
    $(".particle-pen").prepend(div);
  }
});

$(document).ready(function () {
  const RANDOM = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);
  const PARTICLES = document.querySelectorAll(".particle");

  PARTICLES.forEach((P) => {
    P.setAttribute(
      "style",
      `
            --x: ${RANDOM(20, 80)};
            --y: ${RANDOM(20, 80)};
            --duration: ${RANDOM(6, 20)};
            --delay: ${RANDOM(1, 10)};
            --alpha: ${RANDOM(40, 90) / 100};
            --origin-x: ${
              Math.random() > 0.5 ? RANDOM(300, 800) * -1 : RANDOM(300, 800)
            }%;
            --origin-y: ${
              Math.random() > 0.5 ? RANDOM(300, 800) * -1 : RANDOM(300, 800)
            }%;
            --size: ${RANDOM(40, 90) / 100};
        `
    );
  });
});

$(document).ready(function () {
  $(".box img").click(function () {
    const src = $(this).attr("src");
    const alt = $(this).attr("alt");

    $(".current-planet").html(`${alt}`);

    $(".content-container").css({
      background: `url(${src})`,
      "background-size": "cover",
      "background-repeat": "no-repeat",
      "background-position": "center",
      "-webkit-backdrop-filter": "blur(4px)",
      "backdrop-filter": "blur(4px)",
      transition: "all 0.5s ease",
    });

    $(".horo")
      .removeClass("horoHover")
      .addClass("horoHover")
      .css("animation", "none")
      .height();
    void $(".horo").width();
    $(".horo").css("animation", "horoHover2 0.5s 1");
  });
});

$(document).ready(function () {
  $("#view1").click(function () {
    $(".box").removeClass("view1 view2").addClass("view1");
  });
  $("#view2").click(function () {
    $(".box").removeClass("view1 view2").addClass("view2");
  });

  $("#bend").click(function () {
    $(".box").each(function () {
      if ($(this).hasClass("view1")) {
        $(this).removeClass("view1").addClass("view2");
      } else {
        $(this).removeClass("view2").addClass("view1");
      }
    });
  });

  $("#btn360").click(function () {
    $("#scene").toggleClass("hide");
    $("#navView").toggleClass("hide");
  });

  $("#btn-info-p-small").click(function () {
    $("#info-p-small").toggleClass("hidden");
  });
});

$(document).ready(function () {
  const textureMars = "assets/img/texture/texture-mars.jpg";
  const textureEarth = "assets/img/texture/texture-earth.jpg";
  const textureMercury = "assets/img/texture/texture-mercury.jpg";
  const textureVenus = "assets/img/texture/texture-venus.jpg";

  let currentTexture = textureEarth;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  $("#scene-view").append(renderer.domElement);

  const group = new THREE.Group();

  // PARTICLES
  const counts = 3000;
  const positions = new Float32Array(counts * 3);

  for (let i = 0; i < counts * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  const geometryParticle = new THREE.BufferGeometry();
  geometryParticle.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  const alphaMap = new THREE.TextureLoader().load(
    "assets/img/texture/alphamap.png"
  );
  const particlesMarterial = new THREE.PointsMaterial({
    size: 0.01,
    sizeAttenuation: true,
    alphaTest: 0.5,
    alphaMap,
    transparent: true,
  });
  const particle = new THREE.Points(geometryParticle, particlesMarterial);
  group.add(particle);

  const screenSizeRatio =
    Math.min(window.innerWidth, window.innerHeight) * 0.004;
  const radius = screenSizeRatio;

  // SPHERE
  const geometry = new THREE.SphereGeometry(radius, 64, 32);
  const texture = new THREE.TextureLoader().load(textureEarth);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  const sphere = new THREE.Mesh(geometry, material);
  group.add(sphere);

  scene.add(group);

  const light = new THREE.PointLight(0xffffff);
  light.position.set(10, 5, 25);
  scene.add(light);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.target = sphere.position;

  const clock = new THREE.Clock();

  function animate() {
    const time = clock.getElapsedTime();

    particle.rotation.y = time * 0.1;
    sphere.rotation.y += 0.01;

    controls.update();
    renderer.render(scene, camera);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    requestAnimationFrame(animate);
  }

  $("#choseMercure").click(function () {
    currentTexture = textureMercury;
    material.map = new THREE.TextureLoader().load(currentTexture);
    $(".displayName").html("Mercury");
    $(".describePlanet").html(`
        <li><strong>Distance from the Sun:</strong> Mercury is at an average distance of about 57.9 million kilometers (or 0.39 astronomical units) from the Sun.</li>
        <li><strong>Orbital Period:</strong> Mercury has a relatively short orbital period, completing its revolution around the Sun in approximately 88 Earth days.</li>
        <li><strong>Rotation Period:</strong> Mercury has a slow rotation compared to other planets, with a rotation period of about 59 Earth days.</li>
        <li><strong>Diameter:</strong> Mercury has a relatively small diameter of approximately 4,880 kilometers, making it the smallest planet in our solar system.</li>
        <li><strong>Temperature:</strong> Temperatures on Mercury show extreme variations, ranging from about -173 degrees Celsius at night to around 427 degrees Celsius during the day.</li>
        <li><strong>Atmosphere:</strong> Mercury has a very thin atmosphere, primarily composed of trace amounts of hydrogen, helium, and oxygen.</li>
        <li><strong>Geological Features:</strong> The surface of Mercury is characterized by large impact craters, smooth plains, and extensive cliffs known as scarps.</li>
        <li><strong>Exploration:</strong> Several space missions, including Mariner 10 and MESSENGER, have provided detailed information about Mercury's surface, composition, and magnetic field.</li>
    `);
  });
  $("#choseVenus").click(function () {
    currentTexture = textureVenus;
    material.map = new THREE.TextureLoader().load(currentTexture);
    $(".displayName").html("Venus");
    $(".describePlanet").html(`
        <li><strong>Distance from the Sun:</strong> Venus is located at an average distance of about 108.2 million kilometers (or 0.72 astronomical units) from the Sun.</li>
        <li><strong>Orbital Period:</strong> Venus completes its orbit around the Sun in approximately 225 Earth days, making its year shorter than its day.</li>
        <li><strong>Rotation Period:</strong> Venus has an extremely slow rotation, taking about 243 Earth days to complete one rotation on its axis, which is longer than its year.</li>
        <li><strong>Diameter:</strong> Venus has a diameter of approximately 12,104 kilometers, making it slightly smaller than Earth.</li>
        <li><strong>Temperature:</strong> Venus experiences scorching surface temperatures, with an average temperature of about 462 degrees Celsius, making it the hottest planet in our solar system.</li>
        <li><strong>Atmosphere:</strong> Venus has a thick atmosphere primarily composed of carbon dioxide with clouds of sulfuric acid, creating a strong greenhouse effect.</li>
        <li><strong>Geological Features:</strong> The surface of Venus consists of extensive volcanic plains, highland regions, and thousands of impact craters.</li>
        <li><strong>Exploration:</strong> Several missions, including the Venera program and the Magellan spacecraft, have provided valuable insights into Venus's surface, geology, and atmospheric conditions.</li>
    `);
  });
  $("#choseEarth").click(function () {
    currentTexture = textureEarth;
    material.map = new THREE.TextureLoader().load(currentTexture);
    $(".displayName").html("Earth");
    $(".describePlanet").html(`
        <li><strong>Distance from the Sun:</strong> Earth is at an average distance of about 149.6 million kilometers (or 1 astronomical unit) from the Sun.</li>
        <li><strong>Orbital Period:</strong> Earth completes one orbit around the Sun in approximately 365.25 days, defining one Earth year.</li>
        <li><strong>Rotation Period:</strong> Earth has a rotation period of about 24 hours, which defines one complete day.</li>
        <li><strong>Diameter:</strong> Earth has a diameter of approximately 12,742 kilometers, making it the largest of the terrestrial planets.</li>
        <li><strong>Temperature:</strong> Earth has a moderate climate that allows for the existence of liquid water on its surface, with average temperatures ranging from about -50 degrees Celsius to 50 degrees Celsius.</li>
        <li><strong>Atmosphere:</strong> Earth's atmosphere primarily consists of nitrogen and oxygen, providing vital support for life through the greenhouse effect and protection from harmful solar radiation.</li>
        <li><strong>Geological Features:</strong> Earth's surface is characterized by various landforms such as mountains, plains, plateaus, and diverse ecosystems including oceans, forests, and deserts.</li>
        <li><strong>Exploration:</strong> Extensive exploration and study of Earth have been conducted through various scientific disciplines, leading to a comprehensive understanding of its geology, climate, and biodiversity.</li>
    `);
  });
  $("#choseMars").click(function () {
    currentTexture = textureMars;
    material.map = new THREE.TextureLoader().load(currentTexture);
    $(".displayName").html("Mars");
    $(".describePlanet").html(`
        <li><strong>Distance from the Sun:</strong> Mars has an average distance of about 227.9 million kilometers (or 1.52 astronomical units) from the Sun.</li>
        <li><strong>Orbital Period:</strong> Mars orbits the Sun with a revolution period of approximately 687 Earth days.</li>
        <li><strong>Rotation Period:</strong> The rotation period of Mars is slightly longer than Earth's, at about 24 hours and 37 minutes.</li>
        <li><strong>Diameter:</strong> The equatorial diameter of Mars is around 6,792 kilometers, which is about half the size of Earth.</li>
        <li><strong>Temperature:</strong> Temperatures on Mars vary significantly, ranging from about -87 degrees Celsius on average to even colder temperatures at the poles.</li>
        <li><strong>Atmosphere:</strong> Mars has an atmosphere consisting mainly of carbon dioxide (approximately 95.3%) with traces of nitrogen and argon.</li>
        <li><strong>Geological Features:</strong> Mars features distinct geological characteristics such as massive volcanoes, deep canyons like Valles Marineris, and a surface dotted with impact craters.</li>
        <li><strong>Moons:</strong> Mars has two natural moons, Phobos and Deimos, which are relatively small and irregular in shape.</li>
        <li><strong>Exploration:</strong> Several space missions, including rovers like Curiosity and Perseverance, have been sent to Mars to explore its surface, atmosphere, and geology.</li>
    `);
  });

  animate();

  $(window).resize(function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
});
