class AttemptPolicy < ApplicationPolicy
  def index?
    true
  end

  def new?
    index?
  end

  def create?
    index?
  end

  def show?
    index?
  end

  def submit?
    index?
  end

  def answer?
    index?
  end
end
