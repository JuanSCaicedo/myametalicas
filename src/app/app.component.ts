import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener } from '@angular/core';
import { environment } from '../environments/environment';

declare const lucide: any;

interface ProjectModal {
  title: string;
  description: string;
  image: string;
  badge: string;
  alt: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'front';

  protected selectedProject: ProjectModal | null = null;
  protected showBackToTop = false;

  protected readonly pergolaProject: ProjectModal = {
    title: 'Pérgola Residencial',
    description: 'Pérgola bioclimática de 6x4m en acero inoxidable con lamas orientables.',
    image: '/img/1.png',
    badge: 'Diseño + Fabricación + Instalación',
    alt: 'Pérgola Residencial'
  };

  protected readonly fachadaProject: ProjectModal = {
    title: 'Fachada Comercial',
    description: 'Sistema de vidrio templado con marco metálico para centro comercial.',
    image: '/img/2.jpg',
    badge: 'Diseño + Montaje',
    alt: 'Fachada Comercial'
  };

  protected readonly techoProject: ProjectModal = {
    title: 'Techo Industrial',
    description: 'Cubierta metálica con estructura de acero para nave de 1000 m².',
    image: '/img/3.jpg',
    badge: 'Fabricación + Instalación',
    alt: 'Techo Industrial'
  };

  protected readonly rejasProject: ProjectModal = {
    title: 'Rejas de Seguridad',
    description: 'Sistema completo de rejas en acero inoxidable para residencia de 5 pisos.',
    image: '/img/4.jpg',
    badge: 'Cerrajería Técnica',
    alt: 'Rejas de Seguridad'
  };

  protected readonly columnasProject: ProjectModal = {
    title: 'Columnas Estructurales',
    description: 'Columnas de acero para estructura de oficinas de 8 niveles.',
    image: '/img/5.jpg',
    badge: 'Fabricación Especial',
    alt: 'Columnas Estructurales'
  };

  protected readonly divisionesProject: ProjectModal = {
    title: 'Divisiones Modernas',
    description: 'Panel de vidrio laminado con marcos metálicos para espacios corporativos.',
    image: '/img/5.jpg',
    badge: 'Soluciones en Vidrio',
    alt: 'Divisiones Modernas'
  };

  private readonly googleSheetsEndpoint = environment.googleSheetsEndpoint;

  private readonly defaultConfig = {
    company_name: 'MYA METÁLICAS',
    tagline: 'Transformamos ideas en estructuras sólidas. Diseño, fabricación e instalación de estructuras metálicas, pérgolas, techos y cerrajería técnica con excelencia.',
    about_text: 'Somos una empresa líder en el sector de metales y soluciones arquitectónicas en vidrio y acero. Nos especializamos en el diseño, fabricación e instalación de estructuras metálicas, techos y cerrajería técnica.',
    contact_phone: '+57 302 249 5469',
    contact_email: 'contacto&#64;myametalicas.com',
    contact_address: 'Calle 2 #79-47, Cali, Valle del Cauca, Colombia',
    whatsapp_link: 'https://api.whatsapp.com/send?phone=573022495469',
    facebook_link: 'https://www.facebook.com/M.y.A.metalicas',
    instagram_link: 'https://www.instagram.com/m.y.a.metalicas/',
    font_family: 'Oswald',
    font_size: 16
  };

  ngAfterViewInit(): void {
    this.initSdk();
    this.bindAccordion();
    this.bindMobileMenu();
    this.bindSmoothScroll();
    this.bindContactForm();
    lucide.createIcons();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showBackToTop = window.scrollY > 300;
  }

  private initSdk(): void {
    const elementSdk = (window as any).elementSdk;
    const dataSdk = (window as any).dataSdk;

    if (!elementSdk || !dataSdk) {
      return;
    }

    elementSdk.init({
      defaultConfig: this.defaultConfig,
      onConfigChange: async (config: any) => {
        const mergedConfig = { ...this.defaultConfig, ...config };
        this.updateContent(mergedConfig);
      },
      mapToCapabilities: (config: any) => {
        const mergedConfig = { ...this.defaultConfig, ...config };

        return {
          recolorables: [],
          borderables: [],
          fontEditable: {
            get: () => mergedConfig.font_family,
            set: (value: string) => {
              mergedConfig.font_family = value;
              elementSdk.setConfig({ font_family: value });
            }
          },
          fontSizeable: {
            get: () => mergedConfig.font_size,
            set: (value: number) => {
              mergedConfig.font_size = value;
              elementSdk.setConfig({ font_size: value });
            }
          }
        };
      },
      mapToEditPanelValues: (config: any) => {
        const mergedConfig = { ...this.defaultConfig, ...config };

        return new Map([
          ['company_name', mergedConfig.company_name],
          ['tagline', mergedConfig.tagline],
          ['about_text', mergedConfig.about_text],
          ['contact_phone', mergedConfig.contact_phone],
          ['contact_email', mergedConfig.contact_email],
          ['contact_address', mergedConfig.contact_address],
          ['whatsapp_link', mergedConfig.whatsapp_link],
          ['facebook_link', mergedConfig.facebook_link],
          ['instagram_link', mergedConfig.instagram_link]
        ]);
      }
    });

    dataSdk.init({ onDataChanged() { } });
  }

  protected openProjectModal(project: ProjectModal): void {
    if (!project.image) {
      return;
    }

    this.selectedProject = project;
  }

  protected closeProjectModal(): void {
    this.selectedProject = null;
  }

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateContent(config: any): void {
    this.setText('nav-company', config.company_name);

    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
      const companyParts = String(config.company_name || '').trim().split(' ');
      const firstPart = companyParts.shift() ?? config.company_name;
      const rest = companyParts.join(' ');
      heroTitle.innerHTML = `<span class="block">${firstPart}</span><span class="block mt-2 sm:mt-3 text-accent-500">${rest}</span>`;
    }

    this.setText('hero-tagline', config.tagline);
    this.setText('about-text', config.about_text);
    this.setText('contact-phone', config.contact_phone);
    this.setText('contact-email', config.contact_email);
    this.setText('contact-address', config.contact_address);
    this.setText('footer-company', config.company_name);

    const footerPhoneLink = document.querySelector('#footer-phone a') as HTMLAnchorElement | null;
    if (footerPhoneLink) {
      footerPhoneLink.textContent = config.contact_phone;
      footerPhoneLink.href = `tel:${this.normalizePhone(config.contact_phone)}`;
    }

    const footerEmailLink = document.querySelector('#footer-email a') as HTMLAnchorElement | null;
    if (footerEmailLink) {
      footerEmailLink.textContent = config.contact_email;
      footerEmailLink.href = `mailto:${this.normalizeEmail(config.contact_email)}`;
    }

    const footerAddressLink = document.querySelector('#footer-address a') as HTMLAnchorElement | null;
    if (footerAddressLink) {
      footerAddressLink.textContent = config.contact_address;
      footerAddressLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.contact_address)}`;
    }

    this.setHref('whatsapp-link', config.whatsapp_link);
    this.setHref('floating-whatsapp-link', config.whatsapp_link);
    this.setHref('facebook-link', config.facebook_link);
    this.setHref('instagram-link', config.instagram_link);
    this.setHref('footer-facebook', config.facebook_link);
    this.setHref('footer-instagram', config.instagram_link);
    this.setHref('footer-whatsapp', config.whatsapp_link);

    const fontStack = `${config.font_family}, sans-serif`;
    document.querySelectorAll<HTMLElement>('[class*="font-heading"]').forEach((element) => {
      element.style.fontFamily = fontStack;
    });

    lucide.createIcons();
  }

  private bindAccordion(): void {
    document.querySelectorAll<HTMLButtonElement>('.accordion-header').forEach((button) => {
      button.addEventListener('click', () => {
        const content = button.nextElementSibling as HTMLElement | null;
        const icon = button.querySelector('[data-lucide]') as HTMLElement | null;

        if (!content) {
          return;
        }

        document.querySelectorAll<HTMLElement>('.accordion-content.open').forEach((otherContent) => {
          if (otherContent !== content) {
            otherContent.classList.remove('open');
          }
        });

        content.classList.toggle('open');

        if (icon) {
          icon.style.transform = content.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
        }
      });
    });
  }

  private bindMobileMenu(): void {
    const mobileMenuButton = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton?.addEventListener('click', () => {
      mobileMenu?.classList.toggle('hidden');
    });
  }

  private bindSmoothScroll(): void {
    const mobileMenu = document.getElementById('mobile-menu');

    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        event.preventDefault();

        const selector = anchor.getAttribute('href');
        if (!selector) {
          return;
        }

        const target = document.querySelector(selector) as HTMLElement | null;
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          mobileMenu?.classList.add('hidden');
        }
      });
    });
  }

  private bindContactForm(): void {
    document.getElementById('contact-form')?.addEventListener('submit', (event) => {
      void this.submitContactForm(event);
    });
  }

  private async submitContactForm(event: Event): Promise<void> {
    event.preventDefault();

    const submitButton = document.getElementById('submit-btn') as HTMLButtonElement | null;
    const status = document.getElementById('form-status');

    if (!submitButton || !status) {
      return;
    }

    if (!this.isGoogleSheetsConfigured()) {
      status.className = 'mt-4 p-4 bg-red-600/20 border border-red-500/30 rounded text-red-300 text-sm';
      status.textContent = 'Configura la URL de Google Apps Script para activar el envío a Sheets.';
      status.classList.remove('hidden');
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Enviando...</span>';

    try {
      await fetch(this.googleSheetsEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams(this.getContactFormPayload())
      });

      status.className = 'mt-4 p-4 bg-green-600/20 border border-green-500/30 rounded text-green-300 text-sm';
      status.textContent = '✓ Cotización enviada. Nos contactaremos contigo.';
      (event.target as HTMLFormElement | null)?.reset();
    } catch {
      status.className = 'mt-4 p-4 bg-red-600/20 border border-red-500/30 rounded text-red-300 text-sm';
      status.textContent = '✗ Error al enviar. Intenta nuevamente.';
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = '<span>Enviar Cotización</span> <i data-lucide="send" class="w-4 h-4"></i>';
      lucide.createIcons();
      status.classList.remove('hidden');
      setTimeout(() => status.classList.add('hidden'), 5000);
    }
  }

  private getContactFormPayload(): Record<string, string> {
    return {
      name: this.getFieldValue('form-name'),
      email: this.getFieldValue('form-email'),
      phone: this.getFieldValue('form-phone'),
      service: this.getServiceLabel(this.getFieldValue('form-service')),
      message: this.getFieldValue('form-message'),
      source: 'myametalicas-website',
      submitted_at: new Date().toISOString()
    };
  }

  private getServiceLabel(serviceValue: string): string {
    const serviceLabels: Record<string, string> = {
      estructuras: 'Estructuras Metálicas',
      'corte-doblez': 'Corte y Doblez de Lámina',
      'hierro-forjado': 'Diseños en Hierro Forjado',
      'puertas-ventanas': 'Puertas, Ventanas y Cerramientos',
      'vidrio-aluminio': 'Vidrio y Aluminio Arquitectónico',
      'cerrajeria-seguridad': 'Cerrajería y Seguridad',
      mantenimientos: 'Mantenimientos Generales e Industriales',
      otro: 'Otro / Consultoría'
    };

    return serviceLabels[serviceValue] ?? serviceValue;
  }

  private isGoogleSheetsConfigured(): boolean {
    return this.googleSheetsEndpoint.startsWith('http');
  }

  private setText(id: string, value: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  }

  private setHref(id: string, value: string): void {
    const element = document.getElementById(id) as HTMLAnchorElement | null;
    if (element) {
      element.href = value;
    }
  }

  private getFieldValue(id: string): string {
    const field = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    return field?.value ?? '';
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
  }

  private normalizeEmail(email: string): string {
    return email.replace(/&#64;/g, '@').trim();
  }
}
