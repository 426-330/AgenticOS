/**
 * 无服务层时的演示数据（mock）：转发层上游不可达 / 接口不存在时，
 * 按转发路径返回演示数据，页面据此渲染（如运营总览的待办统计与列表）。
 * 接入真实后端后零改动——真实响应优先，演示数据仅在无上游时兜底。
 */

interface TodoItem {
  id: string;
  /** review = 审核类（认证复审 / 银行账户），support = 支持工单 */
  type: "review" | "support";
  typeLabel: string;
  title: string;
  applicant: string;
  submittedAt: string;
}

const TODOS = {
  summary: {
    certReviews: 5,
    tickets: 12,
    bankAccounts: 3,
  },
  items: [
    {
      id: "t-1",
      type: "review",
      typeLabel: "认证复审",
      title: "杭州云启科技有限公司 企业认证申请待复审",
      applicant: "陈晨",
      submittedAt: "2026-10-18 10:24",
    },
    {
      id: "t-2",
      type: "review",
      typeLabel: "认证复审",
      title: "北京星环智能有限公司 企业认证申请待复审",
      applicant: "王磊",
      submittedAt: "2026-10-18 09:51",
    },
    {
      id: "t-3",
      type: "support",
      typeLabel: "支持工单",
      title: "模型接入 429 限流问题",
      applicant: "李娜",
      submittedAt: "2026-10-18 09:47",
    },
    {
      id: "t-4",
      type: "support",
      typeLabel: "支持工单",
      title: "AppKey 权限申请：开通多模态模型",
      applicant: "赵岩",
      submittedAt: "2026-10-17 18:33",
    },
    {
      id: "t-5",
      type: "review",
      typeLabel: "银行账户",
      title: "账户尾号 8842 银行账户待确认",
      applicant: "杭州云启科技有限公司",
      submittedAt: "2026-10-17 16:02",
    },
  ] satisfies TodoItem[],
};

const REVIEW = {
  items: [
    {
      id: "r-1",
      subject: "杭州云启科技有限公司 企业认证申请待复审",
      source: "企业认证（KYB）",
      status: "待复审",
      updatedAt: "2026-10-18 10:24",
    },
    {
      id: "r-2",
      subject: "账户尾号 8842 银行账户待确认",
      source: "银行账户验证",
      status: "待确认",
      updatedAt: "2026-10-18 09:40",
    },
    {
      id: "r-3",
      subject: "北京星环智能有限公司 10 月订单结算复核",
      source: "订单与结算",
      status: "待复核",
      updatedAt: "2026-10-17 18:02",
    },
    {
      id: "r-4",
      subject: "上海澜图科技有限公司 企业认证申请待初审",
      source: "企业认证（KYB）",
      status: "待初审",
      updatedAt: "2026-10-17 15:31",
    },
    {
      id: "r-5",
      subject: "账户尾号 2201 银行账户待确认",
      source: "银行账户验证",
      status: "待确认",
      updatedAt: "2026-10-16 11:58",
    },
  ],
};

/** 按转发路径取演示数据（仅 GET；无匹配返回 undefined → 走空数据兜底）。
 *  query 为转发请求的查询参数，演示数据按其语义过滤（如搜索关键字）。 */
export function getDemoData(parts: string[], query: URLSearchParams): unknown {
  if (parts.join("/") === "todos") {
    return TODOS;
  }
  if (parts.join("/") === "review") {
    const keyword = (query.get("keyword") ?? "").trim().toLowerCase();
    if (!keyword) {
      return REVIEW;
    }
    return {
      items: REVIEW.items.filter((item) =>
        item.subject.toLowerCase().includes(keyword),
      ),
    };
  }
  return undefined;
}
