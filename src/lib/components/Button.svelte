<script lang="ts">
  // Interfaz para un SOLO botón
   let { btn }: { btn: { 
    text: string; 
    href: string; 
    bgColor: string; 
    textColor: string; 
    borderColor?: string; 
    hoverBg?: string; 
    hoverText?: string; 
  } } = $props();
</script>

<a
  href={btn.href}
  class={`w-96
    ${btn.bgColor} 
    ${btn.textColor} 
    ${btn.borderColor || ''} 
    ${btn.hoverBg || ''}
    px-6 py-3 rounded-lg font-semibold transition-all duration-300
    flex items-center justify-center
  `}
>
  {btn.text}
</a>