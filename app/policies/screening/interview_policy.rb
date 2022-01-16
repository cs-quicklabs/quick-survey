class Screening::InterviewPolicy < Screening::BaseScreeningPolicy
  def index?
    user.admin? || user.interviewer? || user.team_lead?
  end
end
