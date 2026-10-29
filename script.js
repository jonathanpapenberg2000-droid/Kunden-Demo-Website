'use strict';
const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('.nav');
function closeMenu(){navigation?.classList.remove('is-open');menuButton?.setAttribute('aria-expanded','false');menuButton?.setAttribute('aria-label','Menü öffnen');}
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');navigation.classList.toggle('is-open',open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
navigation?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();});
window.matchMedia('(min-width: 1051px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

const filters=document.querySelectorAll('.filter');
filters.forEach(button=>button.addEventListener('click',()=>{const category=button.dataset.filter;filters.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));let count=0;document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=category!=='all'&&card.dataset.category!==category;if(!card.hidden)count++;});const output=document.querySelector('.gallery-count');if(output)output.textContent=count+(count===1?' Arbeit':' Arbeiten')+' · '+button.textContent;}));

const lightbox=document.querySelector('.lightbox');
let lastProjectTrigger;
document.querySelectorAll('.project-trigger').forEach(button=>button.addEventListener('click',()=>{lastProjectTrigger=button;const image=button.querySelector('img');lightbox.querySelector('img').src=image.src;lightbox.querySelector('img').alt=image.alt;lightbox.querySelector('h2').textContent=button.dataset.title;lightbox.querySelector('p').textContent=button.dataset.description;lightbox.showModal();document.body.classList.add('modal-open');}));
lightbox?.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
lightbox?.addEventListener('click',event=>{if(event.target===lightbox){const bounds=lightbox.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)lightbox.close();}});
lightbox?.addEventListener('close',()=>{document.body.classList.remove('modal-open');lastProjectTrigger?.focus();});

function revealService(){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target?.matches('details'))target.open=true;}
revealService();window.addEventListener('hashchange',revealService);

const contactForm=document.querySelector('.contact-form');
if(contactForm){const requestedService=new URLSearchParams(location.search).get('leistung');const select=contactForm.querySelector('select');if(requestedService&&Array.from(select.options).some(option=>option.value===requestedService))select.value=requestedService;}
contactForm?.addEventListener('submit',event=>{event.preventDefault();if(!contactForm.reportValidity())return;const data=new FormData(contactForm);const subject='Projektanfrage: '+data.get('service');const body='Guten Tag F&P,\n\nich interessiere mich für '+data.get('service')+'.\n\n'+data.get('message')+'\n\nName: '+data.get('name')+'\nE-Mail: '+data.get('email')+'\nTelefon: '+(data.get('phone')||'nicht angegeben')+'\n';const mailto='mailto:info@fandp-it.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);const fallback=document.querySelector('[data-mail-fallback]');fallback.href=mailto;fallback.hidden=false;document.querySelector('.form-status').textContent='Die E-Mail wurde vorbereitet. Ihr E-Mail-Programm wird geöffnet. Erst dort entscheiden Sie, ob Sie sie versenden.';window.location.href=mailto;});
