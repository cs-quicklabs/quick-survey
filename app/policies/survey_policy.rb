class SurveyPolicy < ApplicationPolicy
    def index?
      user.admin?
    end
end  