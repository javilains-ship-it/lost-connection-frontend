/**
 * LOST CONNECTION - MÓDULO DE SEGURIDAD Y CONTRASEÑAS
 * Sistema de contraseñas opcionales para proteger cuentas
 */

// ==============================================
// GESTIÓN DE CONTRASEÑAS
// ==============================================

const PasswordManager = {
  
  /**
   * Verifica si el usuario tiene contraseña configurada
   */
  hasPassword() {
    return localStorage.getItem('lc_has_password') === 'true';
  },
  
  /**
   * Marca que el usuario tiene contraseña
   */
  setHasPassword(value) {
    localStorage.setItem('lc_has_password', value ? 'true' : 'false');
  },
  
  /**
   * Verifica si ya se mostró el popup de recomendación
   */
  hasSeenPasswordPrompt() {
    return localStorage.getItem('lc_password_prompt_shown') === 'true';
  },
  
  /**
   * Marca que ya se mostró el popup
   */
  setPasswordPromptShown() {
    localStorage.setItem('lc_password_prompt_shown', 'true');
  },
  
  /**
   * Valida fortaleza de contraseña
   */
  validatePassword(password) {
    if (!password || password.length < 6) {
      return {
        valid: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      };
    }
    
    if (password.length > 50) {
      return {
        valid: false,
        message: 'La contraseña es demasiado larga (máximo 50 caracteres)'
      };
    }
    
    // Validar que no sea muy simple
    const simplePasswords = ['123456', 'password', '123456789', 'qwerty', 'abc123', '111111'];
    if (simplePasswords.includes(password.toLowerCase())) {
      return {
        valid: false,
        message: 'Esta contraseña es demasiado común, elige otra más segura'
      };
    }
    
    return {
      valid: true,
      message: 'Contraseña válida'
    };
  },
  
  /**
   * Evalúa la fortaleza de la contraseña
   */
  getPasswordStrength(password) {
    if (!password) return { strength: 0, label: 'Ninguna', color: 'gray' };
    
    let strength = 0;
    
    // Longitud
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Contiene números
    if (/\d/.test(password)) strength += 1;
    
    // Contiene mayúsculas
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contiene minúsculas
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contiene caracteres especiales
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    if (strength <= 2) return { strength: 1, label: 'Débil', color: 'red' };
    if (strength <= 4) return { strength: 2, label: 'Media', color: 'yellow' };
    return { strength: 3, label: 'Fuerte', color: 'green' };
  },
  
  /**
   * Resetea todos los datos de seguridad (útil para logout)
   */
  reset() {
    localStorage.removeItem('lc_has_password');
    localStorage.removeItem('lc_password_prompt_shown');
  }
};

// ==============================================
// TRIGGERS DE SEGURIDAD
// ==============================================

const SecurityTriggers = {
  
  /**
   * Verifica si debe mostrar el popup de protección
   * Se muestra después de:
   * - Primera alerta creada
   * - Primer match recibido
   * - 3 días de uso sin contraseña
   */
  shouldShowPasswordPrompt(userStats) {
    // Ya tiene contraseña
    if (PasswordManager.hasPassword()) return false;
    
    // Ya vio el popup y lo cerró
    if (PasswordManager.hasSeenPasswordPrompt()) return false;
    
    // Si tiene al menos 1 alerta o 1 match, mostrar
    if (userStats.alertsCount >= 1 || userStats.matchesCount >= 1) {
      return true;
    }
    
    // Si tiene más de 3 ubicaciones guardadas
    if (userStats.locationsCount >= 3) {
      return true;
    }
    
    return false;
  },
  
  /**
   * Mensaje personalizado según la situación del usuario
   */
  getPromptMessage(userStats) {
    if (userStats.matchesCount > 0) {
      return {
        title: '🎉 ¡Tienes matches!',
        message: 'Protege tus conversaciones con una contraseña. Así nadie más podrá acceder a tus chats.',
        urgency: 'high'
      };
    }
    
    if (userStats.alertsCount > 0) {
      return {
        title: '⚠️ Protege tu cuenta',
        message: 'Has creado alertas. Añade una contraseña para que nadie más pueda usar tu nickname.',
        urgency: 'medium'
      };
    }
    
    if (userStats.locationsCount >= 3) {
      return {
        title: '📍 Asegura tus datos',
        message: 'Tienes varias ubicaciones guardadas. Protégelas con una contraseña.',
        urgency: 'low'
      };
    }
    
    return {
      title: '🔒 Protege tu cuenta',
      message: 'Añade una contraseña para mayor seguridad.',
      urgency: 'low'
    };
  }
};

// ==============================================
// VALIDACIÓN DE NICKNAME
// ==============================================

const NicknameValidator = {
  
  /**
   * Valida que el nickname cumpla los requisitos
   */
  validate(nickname) {
    if (!nickname || nickname.trim().length === 0) {
      return {
        valid: false,
        message: 'El nickname no puede estar vacío'
      };
    }
    
    const trimmed = nickname.trim();
    
    if (trimmed.length < 3) {
      return {
        valid: false,
        message: 'El nickname debe tener al menos 3 caracteres'
      };
    }
    
    if (trimmed.length > 20) {
      return {
        valid: false,
        message: 'El nickname es demasiado largo (máximo 20 caracteres)'
      };
    }
    
    // Solo letras, números, guiones y guiones bajos
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      return {
        valid: false,
        message: 'El nickname solo puede contener letras, números, guiones y guiones bajos'
      };
    }
    
    // No puede empezar con números
    if (/^\d/.test(trimmed)) {
      return {
        valid: false,
        message: 'El nickname no puede empezar con un número'
      };
    }
    
    return {
      valid: true,
      message: 'Nickname válido',
      normalized: trimmed
    };
  },
  
  /**
   * Sugiere nicknames alternativos si el elegido está ocupado
   */
  getSuggestions(nickname) {
    const base = nickname.replace(/\d+$/, ''); // Quitar números finales
    const random = Math.floor(Math.random() * 999) + 1;
    
    return [
      `${base}${random}`,
      `${base}_${random}`,
      `${base}${new Date().getFullYear()}`,
      `el_${base}`,
      `${base}_real`
    ];
  }
};

// ==============================================
// EXPORTAR PARA USO EN EL NAVEGADOR
// ==============================================

if (typeof window !== 'undefined') {
  window.SecurityManager = {
    password: PasswordManager,
    triggers: SecurityTriggers,
    nickname: NicknameValidator
  };
  
  console.log('✅ Módulo de seguridad cargado');
}

// Para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PasswordManager,
    SecurityTriggers,
    NicknameValidator
  };
}
