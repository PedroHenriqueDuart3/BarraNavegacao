class NavegacaoFixa {
    constructor() {
        // Elementos do DOM
        this.barraNav = document.getElementById('navbar');
        this.progressoScroll = document.getElementById('scrollProgress');
        this.botaoTopo = document.getElementById('scrollToTop');
        this.botaoMobile = document.getElementById('mobileToggle');
        this.menuNav = document.getElementById('navMenu');
        this.linksNav = document.querySelectorAll('.nav-link');
        
        // Propriedades
        this.alturaNavbar = 0;
        
        this.inicializar();
    }

    inicializar() {
        this.calcularAlturaNavbar();
        this.configurarEventos();
        this.configurarObservador();
        this.atualizarLinkAtivo();
        this.atualizarProgresso();
        this.mostrarBotaoTopo();
    }

    // === CONFIGURAÇÕES INICIAIS ===
    calcularAlturaNavbar() {
        this.alturaNavbar = this.barraNav.getBoundingClientRect().height;
    }

    configurarEventos() {
        // Scroll com otimização
        let timeoutScroll;
        window.addEventListener('scroll', () => {
            if (timeoutScroll) cancelAnimationFrame(timeoutScroll);
            timeoutScroll = requestAnimationFrame(() => this.aoRolar());
        });

        // Links de navegação
        this.linksNav.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.rolarParaSecao(link.getAttribute('href'));
                this.fecharMenuMobile();
            });
        });

        // Botão voltar ao topo
        this.botaoTopo.addEventListener('click', () => {
            this.rolarParaSecao('#inicio');
        });

        // Menu mobile
        this.botaoMobile.addEventListener('click', () => {
            this.alternarMenuMobile();
        });

        // Redimensionamento
        window.addEventListener('resize', () => {
            this.calcularAlturaNavbar();
            this.fecharMenuMobile();
        });

        // Tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.fecharMenuMobile();
        });
    }

    configurarObservador() {
        const opcoes = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('visible');
                }
            });
        }, opcoes);

        document.querySelectorAll('.fade-in').forEach(el => {
            observador.observe(el);
        });
    }

    // === FUNÇÕES DE SCROLL ===
    aoRolar() {
        this.alternarNavbarFixo();
        this.atualizarLinkAtivo();
        this.atualizarProgresso();
        this.mostrarBotaoTopo();
    }

    alternarNavbarFixo() {
        const posicaoScroll = window.pageYOffset;
        const deveSerFixo = posicaoScroll > this.alturaNavbar;

        if (deveSerFixo && !this.barraNav.classList.contains('sticky')) {
            this.barraNav.classList.add('sticky');
            document.body.style.paddingTop = `${this.alturaNavbar}px`;
        } else if (!deveSerFixo && this.barraNav.classList.contains('sticky')) {
            this.barraNav.classList.remove('sticky');
            document.body.style.paddingTop = '0';
        }
    }

    atualizarLinkAtivo() {
        const secoes = document.querySelectorAll('section[id]');
        let secaoAtiva = '';

        secoes.forEach(secao => {
            const rect = secao.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.5 && 
                rect.top + rect.height > window.innerHeight * 0.5) {
                secaoAtiva = secao.getAttribute('id');
            }
        });

        this.linksNav.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            link.classList.toggle('active', href === secaoAtiva);
        });
    }

    atualizarProgresso() {
        const posicaoScroll = window.pageYOffset;
        const alturaTotal = document.documentElement.scrollHeight - window.innerHeight;
        const percentual = Math.min((posicaoScroll / alturaTotal) * 100, 100);
        
        this.progressoScroll.style.width = `${percentual}%`;
    }

    mostrarBotaoTopo() {
        const posicaoScroll = window.pageYOffset;
        const deveMostrar = posicaoScroll > window.innerHeight * 0.3;
        
        this.botaoTopo.classList.toggle('visible', deveMostrar);
    }

    // === NAVEGAÇÃO ===
    rolarParaSecao(alvo) {
        const elemento = document.querySelector(alvo);
        
        if (elemento) {
            const offset = this.barraNav.classList.contains('sticky') ? 
                this.alturaNavbar + 20 : 20;
            
            const posicaoElemento = elemento.getBoundingClientRect().top;
            const posicaoFinal = posicaoElemento + window.pageYOffset - offset;
            
            window.scrollTo({
                top: posicaoFinal,
                behavior: 'smooth'
            });
        }
    }

    // === MENU MOBILE ===
    alternarMenuMobile() {
        this.menuNav.classList.toggle('active');
        this.botaoMobile.classList.toggle('active');
        
        document.body.style.overflow = this.menuNav.classList.contains('active') ? 
            'hidden' : '';
    }

    fecharMenuMobile() {
        this.menuNav.classList.remove('active');
        this.botaoMobile.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// === UTILITÁRIOS DE ANIMAÇÃO ===
class UtilsAnimacao {
    static iniciarEfeitosCards() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    static iniciarParallax() {
        const cabecalho = document.querySelector('.main-header');
        
        if (cabecalho) {
            window.addEventListener('scroll', () => {
                const posicaoScroll = window.pageYOffset;
                const parallax = posicaoScroll * 0.5;
                cabecalho.style.transform = `translateY(${parallax}px)`;
            });
        }
    }

    static iniciarAnimacoesCarregamento() {
        const elementos = document.querySelectorAll('.fade-in');
        
        elementos.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar navegação principal
    new NavegacaoFixa();
    
    // Inicializar efeitos visuais
    UtilsAnimacao.iniciarEfeitosCards();
    UtilsAnimacao.iniciarParallax();
    
    // Inicializar animações após carregamento
    setTimeout(() => {
        UtilsAnimacao.iniciarAnimacoesCarregamento();
    }, 100);
    
    console.log('Navegação inicializada com sucesso!');
    console.log('Recursos: Navbar fixa, progresso scroll, animações, menu responsivo');
});

// === MEDIÇÃO DE PERFORMANCE (OPCIONAL) ===
if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark('navegacao-inicio');
    
    window.addEventListener('load', () => {
        performance.mark('navegacao-fim');
        performance.measure('navegacao-carregamento', 'navegacao-inicio', 'navegacao-fim');
        
        const medida = performance.getEntriesByName('navegacao-carregamento')[0];
        console.log(`⚡ Tempo de inicialização: ${medida.duration.toFixed(2)}ms`);
    });
}