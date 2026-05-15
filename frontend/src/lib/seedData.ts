export const topicGroups: Record<string, string[]> = {
  "Processo de Desenvolvimento de Software": [
    "CMMI-DEV v2.0", "ABNT NBR ISO/IEC/IEEE 12207:2021", "MR-MPS-SW versão 2023", "UML 2.5", "BPMN", "Scrum", "Kanban", "XP", "Engenharia de requisitos", "Engenharia de software", "Modelagem e especificação", "Low-code", "No-code", "XML", "JSON", "Documentação técnica", "Dicionário de dados", "Rastreabilidade", "ISO/IEC 25010", "Testes de software", "Gestão de configuração", "Versionamento semântico", "Code review",
  ],
  "Governança e Gestão de TI": [
    "PMBOK 7", "ITIL v4", "COBIT 2019", "PETIC", "PDTIC", "Gestão de portfólio", "SLAs", "OLAs", "Melhoria contínua", "TCO", "ROI", "CAPEX", "OPEX", "FinOps", "ISO 31000", "Lei 14.133/2021", "Gestão de stakeholders", "TOGAF", "Arquitetura corporativa",
  ],
  "Programação": [
    "PHP", "Python", "C", "Java", "C#", "sintaxe", "variáveis", "operadores", "estruturas de controle", "orientação a objetos", "SOLID", "interfaces", "herança", "polimorfismo", "exceções", "acesso a banco", "TDD", "BDD", "Git", "GitFlow", "Pull Requests",
  ],
  "Banco de Dados": [
    "MER", "Normalização", "SQL", "DML", "DDL", "DCL", "Transações", "PostgreSQL", "Oracle", "PL/SQL", "H2", "CTE", "Window Functions", "Data Warehouse", "OLAP", "Data Lake", "NoSQL", "Governança de dados",
  ],
  "Web e Mobile": [
    "HTML5", "CSS3", "Bootstrap 5", "JavaScript", "TypeScript", "React", "React Native", "Angular", "Vue", "Node.js", "REST", "RESTful", "Swagger/OpenAPI", "APIs", "JWT", "OAuth2", "OIDC", "UX", "WCAG", "Responsividade",
  ],
  "Arquitetura de Sistemas": [
    "multicamadas", "cliente-servidor", "SOA", "microsserviços", "MVC", "DDD", "arquitetura hexagonal", "cloud-native", "API Gateway", "circuit breaker", "retries", "timeouts",
  ],
  "DevOps e DevSecOps": ["CI/CD", "pipelines", "IaC", "observabilidade", "logs", "métricas", "Docker", "Kubernetes", "blue/green", "canary release"],
  "Sistemas Operacionais": ["Linux processos", "Linux memória", "Linux paginação", "Linux shell", "Linux administração", "Linux hardening", "Active Directory", "PowerShell", "WSUS"],
  "Redes": ["TCP/IP", "IPv4", "IPv6", "DNS", "DHCP", "HTTP", "HTTPS", "SSH", "FTP", "LDAP", "VLAN", "MPLS", "OSPF", "BGP", "Wi-Fi", "SDN", "VXLAN"],
  "Segurança da Informação": ["ISO 27001", "ISO 27002", "firewall", "IDS", "IPS", "WAF", "DMZ", "NAC", "antivírus", "criptografia", "SSL/TLS", "RBAC", "MFA", "LGPD", "Zero Trust", "SIEM", "EDR", "OWASP Top 10", "IAM", "OAuth2", "OIDC"],
  "Cloud": ["IaaS", "PaaS", "SaaS", "nuvem híbrida", "multicloud", "governança cloud", "alta disponibilidade", "resiliência"],
  "PDPJ-BR": ["Resolução CNJ 522/2023", "Resolução CNJ 396/2021", "Resolução CNJ 335/2020", "Spring Boot", "Spring Cloud", "Eureka", "Zuul", "Keycloak", "RabbitMQ", "Flyway", "Rancher"],
  "Português": ["interpretação de texto", "conectivos", "pontuação", "concordância", "regência", "crase", "reescrita", "subordinação", "coordenação", "semântica", "figuras de linguagem"],
  "Raciocínio Lógico": ["estruturas lógicas", "proposições", "negação", "equivalência", "porcentagem", "regra de três", "estatística", "gráficos", "sequências"],
  "Pessoas com Deficiência": ["Lei 13.146/2015", "Lei 10.098/2000", "Lei 10.048/2000", "Lei 8.899/1994", "Lei 7.853/1989"],
  "Legislação": ["Lei Estadual 9.826/1974", "Lei Estadual 16.397/2017", "Legislação Previdenciária do Ceará"],
};

const rules: Array<[number, string[]]> = [
  [5, ["SQL", "Banco de Dados", "Engenharia de Software", "ITIL", "Redes", "Segurança", "APIs", "REST", "Linux", "Java", "Spring Boot", "interpretação", "estruturas lógicas", "estatística", "Lei Estadual 9.826"]],
  [4, ["Docker", "Kubernetes", "OAuth2", "LGPD", "COBIT", "Scrum", "UML", "Git", "microsserviços", "regência", "concordância"]],
  [3, ["BPMN", "Cloud", "DevOps", "Oracle", "PL/SQL", "NoSQL", "Lei 13.146", "Lei 10.098", "Lei 10.048", "Lei 8.899", "Lei 7.853"]],
  [2, ["TOGAF", "PETIC", "FinOps", "XML", "Low-code", "No-code"]],
  [1, ["PDPJ", "Resolução CNJ 522", "Resolução CNJ 396", "Resolução CNJ 335", "Eureka", "Zuul", "Keycloak", "RabbitMQ", "Flyway", "Rancher"]],
];

export function priorityFor(category: string, name: string) {
  const text = `${category} ${name}`.toLowerCase();
  return rules.find(([, terms]) => terms.some((term) => text.includes(term.toLowerCase())))?.[0] ?? 3;
}

export function seedTopics() {
  return Object.entries(topicGroups).flatMap(([category, names]) =>
    names.map((name) => {
      const priority = priorityFor(category, name);
      return { name, category, priority, weight: priority, status: "pending", module: "tj" };
    }),
  );
}

export const cyberTopicGroups: Record<string, string[]> = {
  "Fase 1 — Fundamentos de TI e Segurança": [
    "Como a internet funciona", "IPv4", "IPv6", "DNS", "DHCP", "NAT", "Gateway", "MAC Address", "TCP/IP", "Modelo OSI", "Switch", "Roteador", "ping", "tracert", "ipconfig", "nslookup", "Cisco Packet Tracer", "Wireshark", "Projeto: rede simples no Packet Tracer", "Estrutura Linux", "Terminal Linux", "Diretórios Linux", "Usuários Linux", "Permissões Linux", "SSH", "Processos Linux", "Serviços Linux", "Logs Linux", "Comandos Linux essenciais", "Ubuntu VM", "Projeto: mini servidor Linux local", "CIA Triad", "Vulnerabilidade", "Exploit", "Malware", "Phishing", "Ransomware", "Engenharia social", "SIEM", "SOC", "Blue Team", "Red Team", "NIST", "ISO 27001", "OWASP Top 10", "Projeto: documentação dos principais ataques",
  ],
  "Fase 2 — Redes e Monitoramento": [
    "TCP", "UDP", "HTTP/HTTPS", "FTP", "SMTP", "Protocolos DNS", "Portas comuns", "Nmap", "Projeto: escaneamento da própria rede", "Captura de pacotes", "Handshake TCP", "DNS requests", "HTTP requests", "TLS", "Projeto: analisar tráfego do navegador", "Projeto: analisar login em sites", "Logs Windows", "Syslog", "Wazuh", "Splunk Free", "ELK Stack", "Projeto: instalar Wazuh localmente", "Firewall", "UFW", "Windows Defender", "MFA", "Hardening Linux", "Hardening Windows", "Projeto: hardening completo da VM Ubuntu",
  ],
  "Fase 3 — Blue Team": [
    "SOC Analyst", "Alertas", "Incidentes", "IOC", "Threat hunting", "MITRE ATT&CK", "Projeto: simulação de incidentes", "Sigma Rules", "VirusTotal", "AbuseIPDB", "Projeto: mini investigação de ameaças", "Active Directory", "Domínio AD", "GPO", "LDAP", "Kerberos", "Projeto: instalar AD em VM", "Resposta a Incidentes", "Contenção", "Erradicação", "Recuperação", "Projeto: simular ransomware",
  ],
  "Fase 4 — Cloud Básico": [
    "AWS IAM", "EC2", "S3", "VPC", "Security Groups", "AWS Cloud Practitioner", "Projeto: infraestrutura simples na AWS", "IAM Policies", "Least Privilege", "MFA em cloud", "CloudTrail", "GuardDuty", "Projeto: monitoramento AWS", "Containers", "Dockerfile", "Imagens Docker", "Volumes Docker", "Projeto: containerizar aplicação Python", "Pods", "Services Kubernetes", "Deployments Kubernetes", "Projeto: aplicação simples no Kubernetes",
  ],
  "Fase 5 — DevSecOps e AppSec": [
    "CI/CD", "Segurança de pipeline", "GitHub Actions", "Secrets management", "Projeto: pipeline com análise de segurança", "AppSec", "SQL Injection", "XSS", "CSRF", "Burp Suite", "OWASP ZAP", "Projeto: testar vulnerabilidades em aplicação local", "JWT", "OAuth", "Rate limiting", "API Gateway", "Projeto: segurança API FastAPI", "Reconhecimento", "Enumeração", "Exploração básica", "TryHackMe", "Hack The Box",
  ],
  "Portfólio e Certificações": [
    "Dashboard de Monitoramento", "Python para segurança", "FastAPI para logs", "Wazuh para portfólio", "Scanner de rede com Nmap", "Relatórios de segurança", "Sistema de Logs com ELK", "Laboratório Blue Team", "Ubuntu Lab", "Windows Server Lab", "Active Directory Lab", "Google Cybersecurity Certificate", "Cisco CyberOps", "Security+", "SC-900", "AZ-900", "LetsDefend", "BlueTeamLabs", "Security Automation", "Detection Engineering", "AI Security",
  ],
};

const cyberRules: Array<[number, string[]]> = [
  [5, ["TCP/IP", "Modelo OSI", "DNS", "Linux", "Logs", "SIEM", "SOC", "Wazuh", "Nmap", "Wireshark", "MITRE", "IOC", "Active Directory", "IAM", "CloudTrail", "GuardDuty", "OWASP", "DevSecOps"]],
  [4, ["IPv4", "IPv6", "SSH", "Malware", "Phishing", "Ransomware", "Syslog", "Hardening", "Firewall", "Sigma", "VirusTotal", "AWS", "Docker", "Kubernetes", "GitHub Actions", "Burp", "ZAP"]],
  [3, ["Packet Tracer", "Windows", "Splunk", "ELK", "Kerberos", "GPO", "VPC", "S3", "EC2", "JWT", "OAuth", "TryHackMe", "Hack The Box"]],
  [2, ["Certificat", "AZ-900", "SC-900", "Cloud Practitioner", "LetsDefend", "BlueTeamLabs"]],
];

function cyberPriorityFor(category: string, name: string) {
  const text = `${category} ${name}`.toLowerCase();
  return cyberRules.find(([, terms]) => terms.some((term) => text.includes(term.toLowerCase())))?.[0] ?? 3;
}

export function seedCyberTopics() {
  return Object.entries(cyberTopicGroups).flatMap(([category, names]) =>
    names.map((name) => {
      const priority = cyberPriorityFor(category, name);
      return { name, category, priority, weight: priority, status: "pending", module: "cyber" };
    }),
  );
}
