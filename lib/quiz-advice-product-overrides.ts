/**
 * Manual action → product links when positional index (1↔1, 2↔2, 3↔3) mismatches intent.
 * Keys: action titleKey. Values: product nameKey (resolved within quiz/category pools).
 */
export const QUIZ_ADVICE_PRODUCT_OVERRIDES: Record<string, string> = {
  // Emergency readiness · Communication
  "quiz.advice.action.emergency-readiness.foundational.communication.week.1.title":
    "quiz.advice.product.emergency-readiness.foundational.communication.2.name",
  "quiz.advice.action.emergency-readiness.foundational.communication.week.3.title":
    "quiz.advice.product.emergency-readiness.foundational.communication.1.name",
  "quiz.advice.action.emergency-readiness.foundational.communication.year.3.title":
    "quiz.advice.product.emergency-readiness.foundational.communication.2.name",
  "quiz.advice.action.emergency-readiness.intermediate.communication.week.2.title":
    "quiz.advice.product.emergency-readiness.intermediate.communication.3.name",
  "quiz.advice.action.emergency-readiness.refinement.communication.week.2.title":
    "quiz.advice.product.emergency-readiness.refinement.communication.1.name",

  // Self-sufficiency · Food (year / planning vs gear)
  "quiz.advice.action.self-sufficiency.foundational.food.year.2.title":
    "quiz.advice.product.self-sufficiency.foundational.food.1.name",
  "quiz.advice.action.self-sufficiency.foundational.food.year.3.title":
    "quiz.advice.product.self-sufficiency.foundational.food.1.name",

  // Water · protocol / planning actions
  "quiz.advice.action.self-sufficiency.foundational.water.year.2.title":
    "quiz.advice.product.self-sufficiency.foundational.water.1.name",
  "quiz.advice.action.emergency-readiness.foundational.water.year.2.title":
    "quiz.advice.product.emergency-readiness.foundational.water.1.name",

  // Medical · records / protocol vs trauma kit
  "quiz.advice.action.emergency-readiness.foundational.medical.year.1.title":
    "quiz.advice.product.emergency-readiness.foundational.medical.3.name",

  // Self-sufficiency · Skills (teach-back → printed procedures, not repair kit)
  "quiz.advice.action.self-sufficiency.foundational.skills.year.2.title":
    "quiz.advice.product.self-sufficiency.foundational.skills.3.name",

  // Self-sufficiency · Shelter (abstract year planning)
  "quiz.advice.action.self-sufficiency.foundational.shelter.year.1.title":
    "quiz.advice.product.self-sufficiency.foundational.shelter.2.name",

  // Self-sufficiency · Energy refinement (load priority → calibration, not consumables)
  "quiz.advice.action.self-sufficiency.refinement.energy.week.1.title":
    "quiz.advice.product.self-sufficiency.refinement.energy.2.name",

  // Emergency readiness · Power refinement
  "quiz.advice.action.emergency-readiness.refinement.power.week.1.title":
    "quiz.advice.product.emergency-readiness.refinement.power.2.name",

  // Emergency readiness · Medical refinement (protocol docs)
  "quiz.advice.action.emergency-readiness.refinement.medical.week.2.title":
    "quiz.advice.product.emergency-readiness.refinement.medical.1.name",

  // Self-sufficiency · Food intermediate month (integration → bulk bins not dehydrator)
  "quiz.advice.action.self-sufficiency.intermediate.food.month.3.title":
    "quiz.advice.product.self-sufficiency.intermediate.food.3.name",

  // Self-sufficiency · Water intermediate year (rainwater → prefilter kit)
  "quiz.advice.action.self-sufficiency.intermediate.water.year.1.title":
    "quiz.advice.product.self-sufficiency.intermediate.water.3.name",

  // Emergency readiness · Communication intermediate (pre-stage kits → grab pouch)
  "quiz.advice.action.emergency-readiness.intermediate.communication.week.3.title":
    "quiz.advice.product.emergency-readiness.intermediate.communication.2.name",

  // Emergency readiness · Power foundational (audit loads → power bank not inverter)
  "quiz.advice.action.emergency-readiness.foundational.power.week.1.title":
    "quiz.advice.product.emergency-readiness.foundational.power.2.name",
}
