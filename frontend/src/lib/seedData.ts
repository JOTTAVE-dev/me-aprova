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
      return { name, category, priority, weight: priority, status: "pending" };
    }),
  );
}
