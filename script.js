document.addEventListener("DOMContentLoaded", () => {
            const barraNav = document.getElementById("navbar");
            const progressoScroll = document.getElementById("scrollProgress");
            const botaoTopo = document.getElementById("scrollToTop");
            const linksNav = document.querySelectorAll(".nav-link");
            const mobileToggle = document.getElementById("mobileToggle");
            const navMenu = document.getElementById("navMenu");
            const fadeElements = document.querySelectorAll(".fade-in");

            let alturaNav = barraNav.getBoundingClientRect().height;

            // Função de scroll principal
            function aoRolar() {
                const posicaoScroll = window.pageYOffset;

                // Navbar sticky
                if (posicaoScroll > alturaNav) {
                    barraNav.classList.add("sticky");
                    document.body.style.paddingTop = `${alturaNav}px`;
                } else {
                    barraNav.classList.remove("sticky");
                    document.body.style.paddingTop = "0";
                }

                // Barra de progresso
                const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
                const progresso = Math.min((posicaoScroll / alturaTotal) * 100, 100);
                progressoScroll.style.width = `${progresso}%`;

                // Botão scroll to top
                botaoTopo.classList.toggle("visible", posicaoScroll > window.innerHeight * 0.3);

                atualizarLinkAtivo();

                animarElementos();
            }

            // Atualizar link ativo da navegação
            function atualizarLinkAtivo() {
                const secoes = document.querySelectorAll("section[id]");
                let secaoAtiva = "";

                secoes.forEach((secao) => {
                    const rect = secao.getBoundingClientRect();
                    if (rect.top <= window.innerHeight * 0.5 && rect.top + rect.height > window.innerHeight * 0.5) {
                        secaoAtiva = secao.id;
                    }
                });

                linksNav.forEach((link) => {
                    const href = link.getAttribute("href").substring(1);
                    link.classList.toggle("active", href === secaoAtiva);
                });
            }

            function animarElementos() {
                fadeElements.forEach((el) => {
                    const rect = el.getBoundingClientRect();
                    if (rect.top < window.innerHeight * 0.8) {
                        el.classList.add("visible");
                    }
                });
            }

            function rolarParaSecao(alvo) {
                const elemento = document.querySelector(alvo);
                if (elemento) {
                    const offset = barraNav.classList.contains("sticky") ? alturaNav + 20 : 20;
                    const posicaoElemento = elemento.getBoundingClientRect().top;
                    const posicaoFinal = posicaoElemento + window.pageYOffset - offset;

                    window.scrollTo({ top: posicaoFinal, behavior: "smooth" });
                }
            }

            window.addEventListener("scroll", aoRolar);
            
            window.addEventListener("resize", () => {
                alturaNav = barraNav.getBoundingClientRect().height;
            });

            linksNav.forEach((link) => {
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    rolarParaSecao(link.getAttribute("href"));
                    // Fechar menu mobile se estiver aberto
                    navMenu.classList.remove("active");
                });
            });

            // Scroll to top button
            botaoTopo.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });

            // Mobile menu toggle
            mobileToggle.addEventListener("click", () => {
                navMenu.classList.toggle("active");
            });

            animarElementos();

            console.log("Navegação ScrollNav inicializada com sucesso!");
        });
