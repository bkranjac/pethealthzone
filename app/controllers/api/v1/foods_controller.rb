module Api
  module V1
    class FoodsController < BaseController
      before_action :set_food, only: %i[ show update destroy ]

      def index
        @foods = Food.all
        render json: @foods
      end

      def show
        render json: @food
      end

      def create
        @food = Food.new(food_params)

        if @food.save
          render json: @food, status: :created
        else
          render json: { errors: @food.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @food.update(food_params)
          render json: @food, status: :ok
        else
          render json: { errors: @food.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @food.destroy!
        head :no_content
      end

      private

      def set_food
        @food = Food.find(params[:id])
      end

      def food_params
        params.require(:food).permit(:name, :food_type, :amount, :description, :purpose, :notes)
      end
    end
  end
end
