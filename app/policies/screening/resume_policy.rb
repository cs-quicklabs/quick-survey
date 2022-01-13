class Screening::ResumePolicy < Screening::BaseScreeningPolicy
  def index?
    user.admin? || user.resume_screener? || user.team_lead?
  end
end
