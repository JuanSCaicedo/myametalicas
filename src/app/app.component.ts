import { AfterViewInit, Component } from '@angular/core';

declare const lucide: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'front';

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
    const dataSdk = (window as any).dataSdk;

    if (!submitButton || !status || !dataSdk) {
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Enviando...</span>';

    const result = await dataSdk.create({
      name: this.getFieldValue('form-name'),
      email: this.getFieldValue('form-email'),
      phone: this.getFieldValue('form-phone'),
      service: this.getFieldValue('form-service'),
      material: this.getFieldValue('form-material'),
      width: this.getFieldValue('form-width'),
      height: this.getFieldValue('form-height'),
      message: this.getFieldValue('form-message'),
      submitted_at: new Date().toISOString()
    });

    submitButton.disabled = false;
    submitButton.innerHTML = '<span>Enviar Cotización</span> <i data-lucide="send" class="w-4 h-4"></i>';
    lucide.createIcons();

    status.classList.remove('hidden');

    if (result.isOk) {
      status.className = 'mt-4 p-4 bg-green-600/20 border border-green-500/30 rounded text-green-300 text-sm';
      status.textContent = '✓ Cotización enviada. Nos contactaremos en máximo 24 horas.';
      (event.target as HTMLFormElement | null)?.reset();
    } else {
      status.className = 'mt-4 p-4 bg-red-600/20 border border-red-500/30 rounded text-red-300 text-sm';
      status.textContent = '✗ Error al enviar. Intenta nuevamente.';
    }

    setTimeout(() => status.classList.add('hidden'), 5000);
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
